import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import useWebSocketLite from '../../helpers/useWebSocketLite';
import { renderWithSockets } from './Menu.test';

jest.mock('../../helpers/useWebSocketLite');

jest.mock(
  '../Rate/Rate',
  () =>
    function () {
      return <div>Rate Me</div>;
    }
);

describe('snnap menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    useWebSocketLite.mockResolvedValue({ data: 0 });
  });

  it('shows no notification icon when no notifications', async () => {
    const message = { alerts: 0, messages: 0 };
    const userNav = await checkUsernameMenu(message, 'msaperst');
    expect(userNav.lastChild.firstChild.textContent).toEqual('Notifications');
  });

  it('shows notifications icon when notifications', async () => {
    const message = { alerts: 2, messages: 2 };
    const userNav = await checkUsernameMenu(message, 'msaperst 🔔');
    expect(userNav.lastChild.firstChild.textContent).toEqual('Notifications2');
  });

  it('shows no messages icon when no messages', async () => {
    const message = { alerts: 0, messages: 0 };
    const userNav = await checkUsernameMenu(message, 'msaperst');
    expect(userNav.lastChild.children[1].textContent).toEqual('Chat');
  });

  it('shows messages icon when messages', async () => {
    const message = { alerts: 2, messages: 2 };
    const userNav = await checkUsernameMenu(message, 'msaperst 🔔');
    expect(userNav.lastChild.children[1].textContent).toEqual('Chat2');
  });

  it('shows no rates when no ratings needed', async () => {
    const message = [];
    const userNav = await renderWithSockets(message);
    expect(userNav.children).toHaveLength(1);
  });

  it('shows rates when ratings needed', async () => {
    const message = [
      { id: 1, userId: 2, jobId: 1 },
      { id: 3, userId: 2, jobId: 2 },
    ];
    const userNav = await renderWithSockets(message);
    expect(userNav.children).toHaveLength(3);
    // the actual modal is verified in Rate.test.jsx
  });

  async function checkUsernameMenu(message, username) {
    const container = await renderWithSockets(message);
    await act(async () => {
      fireEvent.click(screen.getByText(username));
    });
    return container.firstChild.firstChild.lastChild.firstChild.children[1];
  }
});
