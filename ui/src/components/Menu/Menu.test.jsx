import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import Menu from './Menu';

Enzyme.configure({ adapter: new Adapter() });

describe('snnap menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('renders only logo when no user', () => {
    const { container } = render(<Menu />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass(
      'navbar navbar-expand-lg navbar-dark bg-dark'
    );
    expect(container.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild).toHaveClass('container');
    expect(container.firstChild.firstChild.children).toHaveLength(1);
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
  });

  it('renders menu when data', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass(
      'navbar navbar-expand-lg navbar-dark bg-dark'
    );
    expect(container.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild).toHaveClass('container');
    expect(container.firstChild.firstChild.children).toHaveLength(3);
  });

  it('renders main logo when menu', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
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
    ).toHaveTextContent('Gigs');
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
    fireEvent.click(screen.getByText('Gigs'));
    const gigMenu =
      container.firstChild.firstChild.lastChild.firstChild.children[0];
    expect(gigMenu.children).toHaveLength(2);
    expect(gigMenu.lastChild.children).toHaveLength(4);
    expect(gigMenu.lastChild).toHaveClass('dropdown-menu show');
    expect(gigMenu.lastChild.getAttribute('aria-labelledby')).toEqual(
      'gig-dropdown'
    );
    expect(gigMenu.lastChild.getAttribute('data-bs-popper')).toEqual('static');

    expect(gigMenu.lastChild.firstChild).toHaveClass('dropdown-item');
    expect(
      gigMenu.lastChild.firstChild.getAttribute('data-rr-ui-dropdown-item')
    ).toEqual('');
    expect(gigMenu.lastChild.firstChild.getAttribute('id')).toEqual(
      'openNewRequestToHireButton'
    );
    expect(gigMenu.lastChild.firstChild.getAttribute('href')).toEqual('#');
    expect(gigMenu.lastChild.firstChild.getAttribute('role')).toEqual('button');
    expect(gigMenu.lastChild.firstChild.getAttribute('tabIndex')).toEqual('0');
    expect(gigMenu.lastChild.firstChild).toHaveTextContent(
      'New Request to Hire'
    );

    expect(gigMenu.lastChild.children[1].children).toHaveLength(0);

    expect(gigMenu.lastChild.children[2]).toHaveClass('dropdown-item');
    expect(
      gigMenu.lastChild.children[2].getAttribute('data-rr-ui-dropdown-item')
    ).toEqual('');
    expect(gigMenu.lastChild.children[2].getAttribute('href')).toEqual(
      '/hire-requests'
    );
    expect(gigMenu.lastChild.children[2]).toHaveTextContent('My Hire Requests');

    expect(gigMenu.lastChild.lastChild).toHaveClass('dropdown-item');
    expect(
      gigMenu.lastChild.lastChild.getAttribute('data-rr-ui-dropdown-item')
    ).toEqual('');
    expect(gigMenu.lastChild.lastChild.getAttribute('href')).toEqual(
      '/hire-request-applications'
    );
    expect(gigMenu.lastChild.lastChild).toHaveTextContent(
      'My Hire Request Applications'
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
});
