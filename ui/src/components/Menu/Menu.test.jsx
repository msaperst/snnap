import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import Menu from './Menu';

const authenticationService = require('../../services/authentication.service');

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
      'navbar navbar-expand navbar-dark bg-dark'
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
      'navbar navbar-expand navbar-dark bg-dark'
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
    ).toHaveLength(3);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[0]
    ).toHaveTextContent('New Request To Hire');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[1]
    ).toHaveTextContent('Item 2');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2]
    ).toHaveTextContent('msaperst');
  });

  it('has no user menu when not clicked', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].children
    ).toHaveLength(1);
  });

  it('has user menu when clicked', () => {
    const { container } = render(
      <Menu currentUser={{ username: 'msaperst' }} />
    );
    fireEvent.click(screen.getByText('msaperst'));
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].children
    ).toHaveLength(2);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild
        .children
    ).toHaveLength(3);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild
    ).toHaveClass('dropdown-menu show');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild.getAttribute(
        'aria-labelledby'
      )
    ).toEqual('nav-dropdown');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild.getAttribute(
        'data-bs-popper'
      )
    ).toEqual('static');

    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild
        .firstChild
    ).toHaveClass('dropdown-item');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild.firstChild.getAttribute(
        'data-rr-ui-dropdown-item'
      )
    ).toEqual('');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild.firstChild.getAttribute(
        'href'
      )
    ).toEqual('/profile');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild
        .firstChild
    ).toHaveTextContent('Profile');

    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild
        .children[1]
    ).toHaveClass('dropdown-divider');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild.children[1].getAttribute(
        'role'
      )
    ).toEqual('separator');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild
        .children[1]
    ).toHaveTextContent('');

    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild
        .lastChild
    ).toHaveClass('dropdown-item');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild.lastChild.getAttribute(
        'data-rr-ui-dropdown-item'
      )
    ).toEqual('');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild.lastChild.getAttribute(
        'role'
      )
    ).toEqual('button');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild.lastChild.getAttribute(
        'tabIndex'
      )
    ).toEqual('0');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2].lastChild
        .lastChild
    ).toHaveTextContent('Logout');
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
