import React from 'react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { render, waitFor } from '@testing-library/react';
import Message from './Message';

jest.mock('../../services/authentication.service');
const authenticationService = require('../../services/authentication.service');

describe('message', () => {
  let messageRender;
  let message;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    authenticationService.authenticationService.currentUserValue = {
      username: 'user',
    };

    message = {
      id: 2,
      to: 'user',
      from: 'otherUser',
      reviewed: true,
      sentAt: '2023-10-13T04:00:00.000Z',
      body: 'some message',
    };
  });

  it('shows the message information', async () => {
    await loadMessage();
    const { container } = messageRender;
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('bubble-message');
    expect(container.firstChild.getAttribute('data-is')).toEqual(
      'otherUser - 9:00 PM'
    );
    expect(container.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild).toHaveTextContent('some message');
  });

  it('shows the message as from you', async () => {
    message.from = 'user';
    message.to = 'otherUser';
    await loadMessage();
    const { container } = messageRender;
    expect(container.firstChild).toHaveClass('self-message');
  });

  it('shows the message as from them', async () => {
    await loadMessage();
    const { container } = messageRender;
    expect(container.firstChild).toHaveClass('them-message');
  });

  it('shows the message as unread', async () => {
    message.reviewed = false;
    await loadMessage();
    const { container } = messageRender;
    expect(container.firstChild).toHaveClass('unread');
  });

  it('shows the message as read', async () => {
    await loadMessage();
    const { container } = messageRender;
    expect(container.firstChild).not.toHaveClass('unread');
  });

  async function loadMessage() {
    await act(async () => {
      messageRender = render(<Message message={message} />);
      const { container } = messageRender;
      await waitFor(() => container.firstChild);
    });
  }
});
