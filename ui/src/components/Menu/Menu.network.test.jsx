import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import Menu from './Menu';
import useWebSocketLite from '../../helpers/useWebSocketLite';

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

  it('shows rates when ratings needed', async () => {
    const message = [
      { id: 1, userId: 2, jobId: 1 },
      { id: 3, userId: 2, jobId: 2 },
    ];
    const userNav = await renderWithSockets(message);
    expect(userNav.children).toHaveLength(3);
    // the actual modal is verified in Rate.test.jsx
  });

  async function renderWithSockets(message) {
    const data = { message };
    useWebSocketLite.mockReturnValue({ data });

    let menu;
    await act(async () => {
      menu = render(<Menu currentUser={{ username: 'msaperst' }} />);
      const { container } = menu;
      await waitFor(() => container.firstChild);
    });
    const { container } = menu;
    return container;
  }
});
