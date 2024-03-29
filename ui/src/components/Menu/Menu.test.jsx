import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

jest.mock(
  '../ProfileNotification/ProfileNotification',
  () =>
    function () {
      return <div>Check Profile</div>;
    }
);

const mockedNavigate = jest.fn();
jest.mock('react-router-bootstrap', () => ({
  ...jest.requireActual('react-router-bootstrap'),
  useNavigate: () => mockedNavigate,
  // eslint-disable-next-line jsx-a11y/anchor-has-content,react/destructuring-assignment
  LinkContainer: (props) => <span {...props} />,
}));

describe('menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('renders only logo when no user', () => {
    useWebSocketLite.mockResolvedValue({ data: {} });
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

  it('renders menu when data', async () => {
    const container = await renderWithSockets();
    expect(container.children).toHaveLength(2);
    expect(container.firstChild).toHaveClass(
      'navbar navbar-expand-lg navbar-dark'
    );
    expect(container.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild).toHaveClass('container');
    expect(container.firstChild.firstChild.children).toHaveLength(3);
  });

  it('renders main logo when menu', async () => {
    const container = await renderWithSockets();
    expect(checkMainBrand(container)).toBeTruthy();
  });

  it('renders togglable menu when data', async () => {
    const container = await renderWithSockets();
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

  it('renders menu contents when data', async () => {
    const container = await renderWithSockets();
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

  it('has no gig menu when not clicked', async () => {
    const container = await renderWithSockets();
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[0].children
    ).toHaveLength(1);
  });

  it('has gig menu when clicked', async () => {
    const container = await renderWithSockets();
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

    checkMenuItem(gigMenu.lastChild.firstChild, null, 'Create New Job');
    expect(gigMenu.lastChild.firstChild.firstChild.getAttribute('id')).toEqual(
      'openNewJobButton'
    );
    expect(
      gigMenu.lastChild.firstChild.firstChild.getAttribute('role')
    ).toEqual('button');
    expect(
      gigMenu.lastChild.firstChild.firstChild.getAttribute('tabIndex')
    ).toEqual('0');

    checkMenuItem(
      gigMenu.lastChild.children[1],
      '/jobs',
      'Created Job Postings'
    );
    checkMenuItem(
      gigMenu.lastChild.children[2],
      '/job-applications',
      'Submitted Applications'
    );
  });

  it('has no user menu when not clicked', async () => {
    const container = await renderWithSockets();
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[1].children
    ).toHaveLength(1);
  });

  it('has user menu when clicked', async () => {
    const container = await renderWithSockets();
    fireEvent.click(screen.getByText('msaperst'));
    const userNav =
      container.firstChild.firstChild.lastChild.firstChild.children[1];
    expect(userNav.children).toHaveLength(2);
    expect(userNav.lastChild.children).toHaveLength(6);
    expect(userNav.lastChild).toHaveClass('dropdown-menu show');
    expect(userNav.lastChild.getAttribute('aria-labelledby')).toEqual(
      'user-dropdown'
    );
    expect(userNav.lastChild.getAttribute('data-bs-popper')).toEqual('static');

    checkMenuItem(
      userNav.lastChild.firstChild,
      '/notifications',
      'Notifications'
    );
    checkMenuItem(userNav.lastChild.children[1], '/chat', 'Chat');
    checkMenuItem(
      userNav.lastChild.children[2],
      '/profile/msaperst',
      'My Profile'
    );
    checkMenuItem(userNav.lastChild.children[3], '/settings', 'Settings');

    expect(userNav.lastChild.children[4]).toHaveClass('dropdown-divider');
    expect(userNav.lastChild.children[4].getAttribute('role')).toEqual(
      'separator'
    );
    expect(userNav.lastChild.children[4]).toHaveTextContent('');

    expect(userNav.lastChild.getAttribute('to')).toEqual(null);
    expect(userNav.lastChild.lastChild).toHaveClass('dropdown-item');
    expect(
      userNav.lastChild.lastChild.getAttribute('data-rr-ui-dropdown-item')
    ).toEqual('');
    expect(userNav.lastChild.lastChild.getAttribute('href')).toEqual('#');
    expect(userNav.lastChild.lastChild).toHaveTextContent('Logout');
    expect(userNav.lastChild.lastChild.getAttribute('role')).toEqual('button');
    expect(userNav.lastChild.lastChild.getAttribute('tabIndex')).toEqual('0');
  });

  function checkMenuItem(navItem, href, text) {
    expect(navItem.getAttribute('to')).toEqual(href);
    expect(navItem.firstChild).toHaveClass('dropdown-item');
    expect(navItem.firstChild.getAttribute('data-rr-ui-dropdown-item')).toEqual(
      ''
    );
    expect(navItem.firstChild.getAttribute('href')).toEqual('#');
    expect(navItem.firstChild).toHaveTextContent(text);
  }

  it('logs out when clicked', () => {
    let x = 0;
    const updateX = () => {
      x = 1;
    };
    useWebSocketLite.mockResolvedValue({ data: {} });
    render(<Menu currentUser={{ username: 'msaperst' }} logout={updateX} />);
    fireEvent.click(screen.getByText('msaperst'));
    fireEvent.click(screen.getByText('Logout'));
    expect(x).toEqual(1);
  });

  function checkMainBrand(container) {
    const mainBrand = container.firstChild.firstChild.firstChild;
    expect(mainBrand.children).toHaveLength(1);
    expect(mainBrand.firstChild).toHaveClass('navbar-brand');
    expect(mainBrand.firstChild.firstChild).toHaveClass(
      'd-inline-block align-top'
    );
    expect(mainBrand.firstChild.firstChild.getAttribute('alt')).toEqual(
      'SNNAP'
    );
    expect(mainBrand.firstChild.firstChild.getAttribute('src')).toEqual(
      'SNNAP.png'
    );
    return true;
  }

  async function renderWithSockets(message = {}) {
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
