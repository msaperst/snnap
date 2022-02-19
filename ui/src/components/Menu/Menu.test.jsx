import React from 'react';
import { render } from '@testing-library/react';
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

  it('renders nothing when no user', () => {
    const { container } = render(<Menu />);
    expect(container.children).toHaveLength(0);
  });

  it('renders menu when data', () => {
    jest
      .spyOn(
        authenticationService.authenticationService,
        'currentUserValue',
        'get'
      )
      .mockReturnValue({ username: 'msaperst' });
    const { container } = render(<Menu />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass(
      'navbar navbar-expand navbar-dark bg-dark'
    );
    expect(container.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild).toHaveClass('container');
    expect(container.firstChild.firstChild.children).toHaveLength(3);
  });

  it('renders main logo when menu', () => {
    jest
      .spyOn(
        authenticationService.authenticationService,
        'currentUserValue',
        'get'
      )
      .mockReturnValue({ username: 'msaperst' });
    const { container } = render(<Menu />);
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
    jest
      .spyOn(
        authenticationService.authenticationService,
        'currentUserValue',
        'get'
      )
      .mockReturnValue({ username: 'msaperst' });
    const { container } = render(<Menu />);
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
    jest
      .spyOn(
        authenticationService.authenticationService,
        'currentUserValue',
        'get'
      )
      .mockReturnValue({ username: 'msaperst' });
    const { container } = render(<Menu />);
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
});
