import React from 'react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, waitFor } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import Chat from './Chat';

jest.mock('../../services/authentication.service');
const authenticationService = require('../../services/authentication.service');

jest.mock('../../helpers/useWebSocketLite');

describe('chat', () => {
  let chat;
  let chatList;
  let server;
  let x;
  const updateX = () => {
    x = 1;
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    authenticationService.authenticationService.currentUserValue = {
      token: 1234,
      username: 'user',
    };

    chatList = [];
    x = 0;
    server = new WS('wss://localhost:3001/wsapp/conversationList');
  });

  afterEach(() => {
    WS.clean();
  });

  it('displays nothing when no data', async () => {
    await act(async () => {
      chat = render(<Chat />);
      const { container } = chat;
      await waitFor(() => container.firstChild);
    });
    await server.connected;
    const { container } = chat;
    expect(container.children).toHaveLength(2);
    expect(container.firstChild).toHaveTextContent('Conversations');
    expect(container.firstChild.children).toHaveLength(0);

    expect(container.lastChild.getAttribute('innerHTML')).toBeNull();
    expect(container.lastChild).toHaveClass('list-group list-group-flush');
    expect(container.lastChild.children).toHaveLength(0);
  });

  it('displays nothing when no user provided', async () => {
    authenticationService.authenticationService.currentUserValue = {};
    await act(async () => {
      chat = render(<Chat />);
      const { container } = chat;
      await waitFor(() => container.firstChild);
    });
    const { container } = chat;
    expect(container.children).toHaveLength(2);
    expect(container.firstChild.children).toHaveLength(0);
    expect(container.lastChild.children).toHaveLength(0);
  });

  it('displays nothing when no users and no chatwith provided', async () => {
    await loadChat();
    const { container } = chat;
    expect(container.children).toHaveLength(2);
    expect(container.firstChild.children).toHaveLength(0);
    expect(container.lastChild.children).toHaveLength(0);
  });

  it('displays selected chat user when no users and chatwith provided', async () => {
    await loadChat('max');
    const { container } = chat;
    expect(container.children).toHaveLength(2);
    expect(container.firstChild).toHaveTextContent('Conversations');
    expect(container.firstChild.children).toHaveLength(0);

    expect(container.lastChild).toHaveClass('list-group list-group-flush');
    expect(container.lastChild.children).toHaveLength(1);

    checkUser(container.lastChild.firstChild, 'max', true);
  });

  it('displays selected chat user when users and chatwith provided', async () => {
    chatList = [
      { user: 2, username: 'grob', unread: 0 },
      { user: 4, username: 'cmoney', unread: 1 },
      { user: 3, username: 'balls', unread: 0 },
    ];
    await loadChat('cmoney');
    const { container } = chat;
    expect(container.children).toHaveLength(2);
    expect(container.firstChild).toHaveTextContent('Conversations');
    expect(container.firstChild.children).toHaveLength(0);

    expect(container.lastChild).toHaveClass('list-group list-group-flush');
    expect(container.lastChild.children).toHaveLength(3);

    checkUser(container.lastChild.firstChild, 'grob');
    checkUser(container.lastChild.children[1], 'cmoney', true); // no unread, because it's selected
    checkUser(container.lastChild.lastChild, 'balls');
  });

  it('displays users when users and no chatwith provided', async () => {
    chatList = [
      { user: 2, username: 'grob', unread: 0 },
      { user: 4, username: 'cmoney', unread: 1 },
      { user: 3, username: 'balls', unread: 0 },
    ];
    await loadChat();
    const { container } = chat;
    expect(container.lastChild.children).toHaveLength(3);

    checkUser(container.lastChild.firstChild, 'grob');
    checkUser(container.lastChild.children[1], 'cmoney', false, true); // unread, because it's not selected
    checkUser(container.lastChild.lastChild, 'balls');
  });

  it('displays no badge when no unread messages', async () => {
    chatList = [
      { user: 2, username: 'grob', unread: 0 },
      { user: 4, username: 'cmoney', unread: 1 },
      { user: 3, username: 'balls', unread: 0 },
    ];
    await loadChat();
    const { container } = chat;
    expect(container.lastChild.firstChild.children).toHaveLength(0);
  });

  it('displays badge when unread messages', async () => {
    chatList = [
      { user: 2, username: 'grob', unread: 0 },
      { user: 4, username: 'cmoney', unread: 1 },
      { user: 3, username: 'balls', unread: 0 },
    ];
    await loadChat();
    const { container } = chat;
    expect(container.lastChild.children[1].children).toHaveLength(1);
    expect(container.lastChild.children[1].children[0]).toHaveClass(
      'float-end badge rounded-pill bg-primary'
    );
    expect(container.lastChild.children[1].children[0]).toHaveTextContent(1);
  });

  it('selecting a user selects the user', async () => {
    chatList = [
      { user: 2, username: 'grob', unread: 0 },
      { user: 4, username: 'cmoney', unread: 1 },
      { user: 3, username: 'balls', unread: 0 },
    ];
    await loadChat('cmoney');
    const { container } = chat;
    checkUser(container.lastChild.firstChild, 'grob');
    checkUser(container.lastChild.children[1], 'cmoney', true);
    await act(async () => {
      fireEvent.click(container.lastChild.firstChild);
    });
    checkUser(container.lastChild.firstChild, 'grob', true);
    checkUser(container.lastChild.children[1], 'cmoney');
    expect(x).toEqual(1);
  });

  // expects in helper functions
  // eslint-disable-next-line jest/expect-expect
  it('selecting a user remove the badge', async () => {
    chatList = [
      { user: 2, username: 'grob', unread: 0 },
      { user: 4, username: 'cmoney', unread: 1 },
      { user: 3, username: 'balls', unread: 0 },
    ];
    await loadChat('grob');
    const { container } = chat;
    checkUser(container.lastChild.firstChild, 'grob', true);
    checkUser(container.lastChild.children[1], 'cmoney', false, true);
    await act(async () => {
      fireEvent.click(container.lastChild.children[1]);
    });
    checkUser(container.lastChild.firstChild, 'grob');
    checkUser(container.lastChild.children[1], 'cmoney', false, true); // only removes the badge when loading from the above container
  });

  async function loadChat(chatWith) {
    await act(async () => {
      chat = render(<Chat chatWith={chatWith} changeChat={updateX} />);
      const { container } = chat;
      await waitFor(() => container.firstChild);
    });
    await server.connected;
    server.send(JSON.stringify(chatList));
  }

  function checkUser(input, user, active = false, unread = false) {
    expect(input).toHaveClass(
      'list-group-item list-group-item-primary list-group-item-action'
    );
    if (active) {
      expect(input).toHaveClass('active');
    }
    expect(input.getAttribute('data-rr-ui-event-key')).toEqual(`#${user}`);
    expect(input.getAttribute('href')).toEqual(`#${user}`);
    expect(input).toHaveTextContent(user);
    if (unread) {
      expect(input.children).toHaveLength(1);
    } else {
      expect(input.children).toHaveLength(0);
    }
  }
});
