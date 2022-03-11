import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import Avatar from './Avatar';

jest.mock('../../services/user.service');
const userService = require('../../services/user.service');

Enzyme.configure({ adapter: new Adapter() });

describe('avatar', () => {
  let mockedInitials;
  let mockedPic;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    userService.userService.get.mockResolvedValue({
      first_name: 'Max',
      last_name: 'Saperstone',
    });
    mockedInitials = render(<Avatar userId={1} />).container;
    userService.userService.get.mockResolvedValue({
      avatar: 'pic.jpg',
    });
    mockedPic = render(<Avatar userId={1} />).container;
  });

  it('renders nothing when no user value is provided', () => {
    userService.userService.get.mockResolvedValue();
    const { container } = render(<Avatar />);
    expect(container.children).toHaveLength(0);
  });

  it('renders an empty circle without an user information', () => {
    userService.userService.get.mockResolvedValue();
    const { container } = render(<Avatar userId={1} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('col-md-1');
    expect(container.firstChild.children).toHaveLength(2);

    expect(container.firstChild.firstChild.children).toHaveLength(0);
    expect(container.firstChild.firstChild).toHaveClass('rounded-circle');
    expect(container.firstChild.firstChild.getAttribute('id')).toEqual(
      'avatar'
    );

    expect(container.firstChild.lastChild.children).toHaveLength(0);
    expect(container.firstChild.lastChild.getAttribute('id')).toEqual(
      'initials'
    );
    expect(container.firstChild.lastChild).toHaveTextContent('');
  });

  it('renders a circle with initial with an user information', async () => {
    expect(mockedInitials.children).toHaveLength(1);
    expect(mockedInitials.firstChild).toHaveClass('col-md-1');
    expect(mockedInitials.firstChild.children).toHaveLength(2);

    expect(mockedInitials.firstChild.firstChild.children).toHaveLength(0);
    expect(mockedInitials.firstChild.firstChild).toHaveClass('rounded-circle');
    expect(mockedInitials.firstChild.firstChild.getAttribute('id')).toEqual(
      'avatar'
    );

    expect(mockedInitials.firstChild.lastChild.children).toHaveLength(0);
    expect(mockedInitials.firstChild.lastChild.getAttribute('id')).toEqual(
      'initials'
    );
    expect(mockedInitials.firstChild.lastChild).toHaveTextContent('MS');
  });

  it('renders the avatar image with an avatar data', () => {
    expect(mockedPic.children).toHaveLength(1);
    expect(mockedPic.firstChild).toHaveClass('col-md-1');
    expect(mockedPic.firstChild.children).toHaveLength(1);

    expect(mockedPic.firstChild.firstChild.children).toHaveLength(0);
    expect(mockedPic.firstChild.firstChild).toHaveClass('rounded-circle');
    expect(mockedPic.firstChild.firstChild.getAttribute('id')).toEqual(
      'avatar'
    );
    expect(mockedPic.firstChild.firstChild.getAttribute('src')).toEqual(
      'pic.jpg'
    );
  });
});
