import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import Avatar from './Avatar';

Enzyme.configure({ adapter: new Adapter() });

describe('avatar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('renders nothing when no user value is provided', () => {
    const { container } = render(<Avatar />);
    expect(container.children).toHaveLength(0);
  });

  it('renders an empty circle without an user information', () => {
    const { container } = render(<Avatar user={{}} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('col-md-2');
    expect(container.firstChild.children).toHaveLength(3);

    expect(container.firstChild.firstChild.children).toHaveLength(0);
    expect(container.firstChild.firstChild).toHaveClass('rounded-circle');
    expect(container.firstChild.firstChild.getAttribute('id')).toEqual(
      'avatar'
    );

    expect(container.firstChild.children[1].children).toHaveLength(0);
    expect(container.firstChild.children[1].getAttribute('id')).toEqual(
      'initials'
    );
    expect(container.firstChild.children[1].getAttribute('role')).toEqual(
      'button'
    );
    expect(container.firstChild.children[1].getAttribute('tabindex')).toEqual(
      '0'
    );
    expect(container.firstChild.children[1]).toHaveTextContent('');

    expect(container.firstChild.lastChild.children).toHaveLength(0);
    expect(container.firstChild.lastChild).toHaveClass('form-control');
    expect(container.firstChild.lastChild.getAttribute('type')).toEqual('file');
    expect(container.firstChild.lastChild.getAttribute('hidden')).toEqual('');
  });

  it('renders a circle with initial with an user information', () => {
    const { container } = render(
      <Avatar user={{ firstName: 'Max', lastName: 'Saps' }} />
    );
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('col-md-2');
    expect(container.firstChild.children).toHaveLength(3);

    expect(container.firstChild.firstChild.children).toHaveLength(0);
    expect(container.firstChild.firstChild).toHaveClass('rounded-circle');
    expect(container.firstChild.firstChild.getAttribute('id')).toEqual(
      'avatar'
    );

    expect(container.firstChild.children[1].children).toHaveLength(0);
    expect(container.firstChild.children[1].getAttribute('id')).toEqual(
      'initials'
    );
    expect(container.firstChild.children[1].getAttribute('role')).toEqual(
      'button'
    );
    expect(container.firstChild.children[1].getAttribute('tabindex')).toEqual(
      '0'
    );
    expect(container.firstChild.children[1]).toHaveTextContent('MS');

    expect(container.firstChild.lastChild.children).toHaveLength(0);
    expect(container.firstChild.lastChild).toHaveClass('form-control');
    expect(container.firstChild.lastChild.getAttribute('type')).toEqual('file');
    expect(container.firstChild.lastChild.getAttribute('hidden')).toEqual('');
  });

  it('renders the avatar image with an avatar data', () => {
    const { container } = render(<Avatar user={{ avatar: 'pic.jpg' }} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('col-md-2');
    expect(container.firstChild.children).toHaveLength(2);

    expect(container.firstChild.firstChild.children).toHaveLength(0);
    expect(container.firstChild.firstChild).toHaveClass('rounded-circle');
    expect(container.firstChild.firstChild.getAttribute('id')).toEqual(
      'avatar'
    );
    expect(container.firstChild.firstChild.getAttribute('src')).toEqual(
      'avatars/pic.jpg'
    );

    expect(container.firstChild.lastChild.children).toHaveLength(0);
    expect(container.firstChild.lastChild).toHaveClass('form-control');
    expect(container.firstChild.lastChild.getAttribute('type')).toEqual('file');
    expect(container.firstChild.lastChild.getAttribute('hidden')).toEqual('');
  });

  // TODO - test the uploading functionality calls
});
