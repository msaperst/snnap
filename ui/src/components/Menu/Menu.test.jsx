import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import Menu from './Menu';
import useWebSocketLite from '../../helpers/useWebSocketLite';

jest.mock('../../helpers/useWebSocketLite');

describe('snnap menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    useWebSocketLite.mockResolvedValue({ data: 0 });
  });

  it('renders only logo when no user', () => {
    const { container } = render(<Menu />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass(
      'navbar navbar-expand-lg navbar-dark'
    );
    expect(container.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild).toHaveClass('container');
    expect(container.firstChild.firstChild.children).toHaveLength(1);
    expect(checkMainBrand(container)).toBeTruthy();
  });

  it('renders menu when data', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass(
      'navbar navbar-expand-lg navbar-dark'
    );
    expect(container.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild).toHaveClass('container');
    expect(container.firstChild.firstChild.children).toHaveLength(3);
  });

  it('renders main logo when menu', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
    expect(checkMainBrand(container)).toBeTruthy();
  });

  it('renders togglable menu when data', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
    expect(container.firstChild.firstChild.children[1]).toHaveClass(
      'navbar-toggler collapsed'
    );
    expect(
      container.firstChild.firstChild.children[1].getAttribute('aria-controls')
    ).toEqual('responsive-navbar-nav');
    expect(
      container.firstChild.firstChild.children[1].getAttribute('aria-label')
    ).toEqual('Toggle navigation');
    expect(
      container.firstChild.firstChild.children[1].getAttribute('type')
    ).toEqual('button');
    expect(container.firstChild.firstChild.children[1].firstChild).toHaveClass(
      'navbar-toggler-icon'
    );
  });

  it('renders menu contents when data', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
    expect(container.firstChild.firstChild.lastChild).toHaveClass(
      'navbar-collapse collapse'
    );
    expect(
      container.firstChild.firstChild.lastChild.getAttribute('id')
    ).toEqual('responsive-navbar-nav');
    expect(container.firstChild.firstChild.lastChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild.lastChild.firstChild).toHaveClass(
      'ml-auto navbar-nav'
    );
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children
    ).toHaveLength(2);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[0]
    ).toHaveTextContent('My Jobs');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[1]
    ).toHaveTextContent('msaperst');
  });

  it('has no gig menu when not clicked', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[0].children
    ).toHaveLength(1);
  });

  it('has gig menu when clicked', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
    fireEvent.click(screen.getByText('My Jobs'));
    const gigMenu =
      container.firstChild.firstChild.lastChild.firstChild.children[0];
    expect(gigMenu.children).toHaveLength(2);
    expect(gigMenu.lastChild.children).toHaveLength(3);
    expect(gigMenu.lastChild).toHaveClass('dropdown-menu show');
    expect(gigMenu.lastChild.getAttribute('aria-labelledby')).toEqual(
      'gig-dropdown'
    );
    expect(gigMenu.lastChild.getAttribute('data-bs-popper')).toEqual('static');

    expect(gigMenu.lastChild.firstChild.firstChild).toHaveClass(
      'dropdown-item'
    );
    expect(
      gigMenu.lastChild.firstChild.firstChild.getAttribute(
        'data-rr-ui-dropdown-item'
      )
    ).toEqual('');
    expect(gigMenu.lastChild.firstChild.firstChild.getAttribute('id')).toEqual(
      'openNewJobButton'
    );
    expect(
      gigMenu.lastChild.firstChild.firstChild.getAttribute('href')
    ).toEqual('#');
    expect(
      gigMenu.lastChild.firstChild.firstChild.getAttribute('role')
    ).toEqual('button');
    expect(
      gigMenu.lastChild.firstChild.firstChild.getAttribute('tabIndex')
    ).toEqual('0');
    expect(gigMenu.lastChild.firstChild.firstChild).toHaveTextContent(
      'New Job'
    );

    expect(gigMenu.lastChild.children[1]).toHaveClass('dropdown-item');
    expect(
      gigMenu.lastChild.children[1].getAttribute('data-rr-ui-dropdown-item')
    ).toEqual('');
    expect(gigMenu.lastChild.children[1].getAttribute('href')).toEqual('/jobs');
    expect(gigMenu.lastChild.children[1]).toHaveTextContent('My Jobs');

    expect(gigMenu.lastChild.lastChild).toHaveClass('dropdown-item');
    expect(
      gigMenu.lastChild.lastChild.getAttribute('data-rr-ui-dropdown-item')
    ).toEqual('');
    expect(gigMenu.lastChild.lastChild.getAttribute('href')).toEqual(
      '/job-applications'
    );
    expect(gigMenu.lastChild.lastChild).toHaveTextContent(
      "Jobs I've Applied To"
    );
  });

  it('has no user menu when not clicked', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[1].children
    ).toHaveLength(1);
  });

  it('has user menu when clicked', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
    fireEvent.click(screen.getByText('msaperst'));
    const userNav =
      container.firstChild.firstChild.lastChild.firstChild.children[1];
    expect(userNav.children).toHaveLength(2);
    expect(userNav.lastChild.children).toHaveLength(4);
    expect(userNav.lastChild).toHaveClass('dropdown-menu show');
    expect(userNav.lastChild.getAttribute('aria-labelledby')).toEqual(
      'user-dropdown'
    );
    expect(userNav.lastChild.getAttribute('data-bs-popper')).toEqual('static');

    expect(userNav.lastChild.firstChild).toHaveClass('dropdown-item');
    expect(
      userNav.lastChild.firstChild.getAttribute('data-rr-ui-dropdown-item')
    ).toEqual('');
    expect(userNav.lastChild.firstChild.getAttribute('href')).toEqual(
      '/notifications'
    );
    expect(userNav.lastChild.firstChild).toHaveTextContent('Notifications');

    expect(userNav.lastChild.children[1]).toHaveClass('dropdown-item');
    expect(
      userNav.lastChild.children[1].getAttribute('data-rr-ui-dropdown-item')
    ).toEqual('');
    expect(userNav.lastChild.children[1].getAttribute('href')).toEqual(
      '/profile'
    );
    expect(userNav.lastChild.children[1]).toHaveTextContent('Profile');

    expect(userNav.lastChild.children[2]).toHaveClass('dropdown-divider');
    expect(userNav.lastChild.children[2].getAttribute('role')).toEqual(
      'separator'
    );
    expect(userNav.lastChild.children[2]).toHaveTextContent('');

    expect(userNav.lastChild.lastChild).toHaveClass('dropdown-item');
    expect(
      userNav.lastChild.lastChild.getAttribute('data-rr-ui-dropdown-item')
    ).toEqual('');
    expect(userNav.lastChild.lastChild.getAttribute('role')).toEqual('button');
    expect(userNav.lastChild.lastChild.getAttribute('tabIndex')).toEqual('0');
    expect(userNav.lastChild.lastChild).toHaveTextContent('Logout');
  });

  it('logs out when clicked', () => {
    let x = 0;
    const updateX = () => {
      x = 1;
    };
    render(<Menu currentUser={{ username: 'msaperst' }} logout={updateX} />);
    fireEvent.click(screen.getByText('msaperst'));
    fireEvent.click(screen.getByText('Logout'));
    expect(x).toEqual(1);
  });

  it('shows no notification icon when no notifications', async () => {
    const message = 0;
    const userNav = await renderWithSockets(message, 'msaperst');
    expect(userNav.lastChild.firstChild.textContent).toEqual('Notifications');
  });

  it('shows notifications icon when notifications', async () => {
    const message = 2;
    const userNav = await renderWithSockets(message, 'msaperst 🔔');
    expect(userNav.lastChild.firstChild.textContent).toEqual('Notifications2');
  });

  function checkMainBrand(container) {
    expect(container.firstChild.firstChild.firstChild).toHaveClass(
      'navbar-brand'
    );
    expect(container.firstChild.firstChild.firstChild.firstChild).toHaveClass(
      'd-inline-block align-top'
    );
    expect(
      container.firstChild.firstChild.firstChild.firstChild.getAttribute('alt')
    ).toEqual('SNNAP');
    expect(
      container.firstChild.firstChild.firstChild.firstChild.getAttribute('src')
    ).toEqual('SNNAP.png');
    return true;
  }

  async function renderWithSockets(message, username) {
    const data = { message };
    useWebSocketLite.mockReturnValue({ data });

    let menu;
    await act(async () => {
      menu = render(<Menu currentUser={{ username: 'msaperst' }} />);
      const { container } = menu;
      await waitFor(() => container.firstChild);
    });
    const { container } = menu;

    fireEvent.click(screen.getByText(username));
    return container.firstChild.firstChild.lastChild.firstChild.children[1];
  }
});
