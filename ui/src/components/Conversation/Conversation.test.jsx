import React from 'react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, waitFor } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import Conversation from './Conversation';

jest.mock('../../services/authentication.service');
const authenticationService = require('../../services/authentication.service');

jest.mock('../../services/chat.service');
const chatService = require('../../services/chat.service');

describe('conversation', () => {
  let message;
  let conversation;
  let server;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    authenticationService.authenticationService.currentUserValue = {
      username: 'user',
    };
    chatService.chatService.getConversationWith.mockResolvedValue([
      {
        id: 2,
        to: 'user',
        from: 'max',
        reviewed: true,
        sentAt: '2023-10-13T04:00:00.000Z',
        body: 'hi',
      },
      {
        id: 3,
        to: 'user',
        from: 'max',
        reviewed: true,
        sentAt: '2023-10-13T04:00:01.000Z',
        body: 'you there?',
      },
      {
        id: 4,
        to: 'max',
        from: 'user',
        reviewed: false,
        sentAt: '2023-10-13T04:01:00.000Z',
        body: "yeah, what's up?",
      },
    ]);
    Element.prototype.scrollIntoView = jest.fn();
    server = new WS('wss://localhost:3001/wsapp/');

    message = {
      id: 5,
      to: 'max',
      from: 'user',
      reviewed: false,
      sentAt: '2023-10-13T04:01:00.000Z',
      body: 'you still there?',
    };
  });

  afterEach(() => {
    WS.clean();
  });

  it('has nothing without chatwith', async () => {
    await act(async () => {
      conversation = render(<Conversation />);
      const { container } = conversation;
      await waitFor(() => container.firstChild);
    });
    const { container } = conversation;
    expect(container.children).toHaveLength(0);
  });

  it('has the expected header', async () => {
    await loadConversation();
    const { container } = conversation;
    expect(container.children).toHaveLength(3);
    expect(container.firstChild).toHaveTextContent('Chat with max');
  });

  it('displays all provided messages', async () => {
    await loadConversation();
    const { container } = conversation;
    expect(container.children[1].getAttribute('id')).toEqual(
      'chat-view-container'
    );
    // there is one more than the messages, to assist with scrolling
    expect(container.children[1].children).toHaveLength(4);
    // the rest is verified by Messages.test
  });

  it('has the send properly configured', async () => {
    await loadConversation();
    const { container } = conversation;
    expect(container.lastChild.getAttribute('id')).toEqual('sendMessageForm');
    expect(container.lastChild.children).toHaveLength(1);
    expect(container.lastChild.firstChild).toHaveClass('mt-3 row');
    expect(container.lastChild.firstChild.children).toHaveLength(2);

    expect(container.lastChild.firstChild.firstChild).toHaveClass('col-10');
    expect(container.lastChild.firstChild.firstChild.children).toHaveLength(1);
    const input =
      container.lastChild.firstChild.firstChild.firstChild.firstChild;
    expect(input.getAttribute('id')).toEqual('formMessage');
    expect(input.getAttribute('type')).toEqual('text');
    expect(input.getAttribute('required')).toEqual('');
    expect(input.getAttribute('disabled')).toBeNull();
    expect(input.getAttribute('value')).toEqual('');
    expect(input).toHaveTextContent('');
    // The rest is verified in SnnapInputForm.test

    expect(container.lastChild.firstChild.lastChild).toHaveClass('col-2');
    expect(container.lastChild.firstChild.lastChild.children).toHaveLength(1);
    const button = container.lastChild.firstChild.lastChild.firstChild;
    expect(button).toHaveClass('btn btn-primary');
    expect(button.getAttribute('aria-label')).toEqual('Send');
    expect(button.getAttribute('disabled')).toEqual('');
    expect(button.getAttribute('style')).toEqual('height: 100%; width: 100%;');
    expect(button.getAttribute('type')).toEqual('button');
    expect(button.children).toHaveLength(1);
    expect(button.firstChild).toHaveTextContent('');
  });

  it('is enabled when text entered', async () => {
    await loadConversation();
    const { container } = conversation;
    const input =
      container.lastChild.firstChild.firstChild.firstChild.firstChild;
    await act(async () => {
      fireEvent.change(input, {
        target: { value: 'message' },
      });
    });
    const button = container.lastChild.firstChild.lastChild.firstChild;
    expect(button.getAttribute('disabled')).toBeNull();
  });

  it('does not add a message when no match', async () => {
    await loadConversation();
    const { container } = conversation;
    message.to = 'someone';
    server.send(JSON.stringify(message));
    // there is one more than the messages, to assist with scrolling
    expect(container.children[1].children).toHaveLength(4);
  });

  it('adds a message when to matches chat with', async () => {
    await loadConversation();
    const { container } = conversation;
    server.send(JSON.stringify(message));
    // there is one more than the messages, to assist with scrolling
    expect(container.children[1].children).toHaveLength(5);
  });

  it('adds a message when from matches chat with', async () => {
    await loadConversation();
    const { container } = conversation;
    message.to = 'user';
    message.from = 'max';
    server.send(JSON.stringify(message));
    // there is one more than the messages, to assist with scrolling
    expect(container.children[1].children).toHaveLength(5);
  });

  it('does not mark message as read', async () => {
    await loadConversation();
    const { container } = conversation;
    let unread = container.getElementsByClassName('unread');
    expect(unread).toHaveLength(1);
    server.send(JSON.stringify(message));
    unread = container.getElementsByClassName('unread');
    expect(unread).toHaveLength(2);
  });

  it('marks the message as read when it is from you and reviewed', async () => {
    await loadConversation();
    const { container } = conversation;
    let unread = container.getElementsByClassName('unread');
    expect(unread).toHaveLength(1);
    message.reviewed = true;
    server.send(JSON.stringify(message));
    unread = container.getElementsByClassName('unread');
    expect(unread).toHaveLength(0);
  });

  it('marks the message as read when it is from someone else', async () => {
    await loadConversation();
    const { container } = conversation;
    let unread = container.getElementsByClassName('unread');
    expect(unread).toHaveLength(1);
    message.to = 'user';
    message.from = 'max';
    message.reviewed = true;
    server.send(JSON.stringify(message));
    unread = container.getElementsByClassName('unread');
    expect(unread).toHaveLength(0);
  });

  it('scrolls as more messages are added', async () => {
    const spy = jest.spyOn(Element.prototype, 'scrollIntoView');
    await loadConversation();
    expect(spy).toHaveBeenCalledTimes(2);
    server.send(JSON.stringify(message));
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('sends a message', async () => {
    await loadConversation();
    const { container, getByRole } = conversation;
    const input =
      container.lastChild.firstChild.firstChild.firstChild.firstChild;
    await act(async () => {
      fireEvent.change(input, {
        target: { value: 'message' },
      });
    });
    await act(async () => {
      fireEvent.click(getByRole('button'));
    });
    await expect(server).toReceiveMessage(
      '{"to":"max","from":"user","body":"message"}'
    );
    expect(input.getAttribute('value')).toEqual('');
  });

  it('does not send a message if no message', async () => {
    await loadConversation();
    const { container, getByRole } = conversation;
    const input =
      container.lastChild.firstChild.firstChild.firstChild.firstChild;
    await act(async () => {
      fireEvent.click(getByRole('button'));
    });
    expect(server).toHaveReceivedMessages([]);
    expect(input.getAttribute('value')).toEqual('');
  });

  async function loadConversation() {
    await act(async () => {
      conversation = render(<Conversation chatWith="max" />);
      const { container } = conversation;
      await waitFor(() => container.firstChild);
      await server.connected;
    });
  }
});
