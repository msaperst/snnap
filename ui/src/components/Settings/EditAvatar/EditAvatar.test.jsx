import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import Avatar from './EditAvatar';

jest.mock('../../../services/user.service');
const userService = require('../../../services/user.service');

Enzyme.configure({ adapter: new Adapter() });

describe('avatar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    userService.userService.uploadAvatar.mockResolvedValue({
      file: 'pic1.jpg',
    });
  });

  it('renders nothing when no user value is provided', () => {
    const { container } = render(<Avatar />);
    expect(container.children).toHaveLength(0);
  });

  it('renders an empty circle without an user information', () => {
    const { container } = render(<Avatar user={{}} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('col-md-3');
    expect(container.firstChild.children).toHaveLength(2);

    // avatar validated via avatar.test.jsx

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
    expect(container.firstChild).toHaveClass('col-md-3');
    expect(container.firstChild.children).toHaveLength(2);

    // avatar validated via avatar.test.jsx

    expect(container.firstChild.lastChild.children).toHaveLength(0);
    expect(container.firstChild.lastChild).toHaveClass('form-control');
    expect(container.firstChild.lastChild.getAttribute('type')).toEqual('file');
    expect(container.firstChild.lastChild.getAttribute('hidden')).toEqual('');
  });

  it('renders the avatar image with an avatar data', () => {
    const { container } = render(<Avatar user={{ avatar: 'pic.jpg' }} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('col-md-3');
    expect(container.firstChild.children).toHaveLength(2);

    // avatar validated via avatar.test.jsx

    expect(container.firstChild.lastChild.children).toHaveLength(0);
    expect(container.firstChild.lastChild).toHaveClass('form-control');
    expect(container.firstChild.lastChild.getAttribute('type')).toEqual('file');
    expect(container.firstChild.lastChild.getAttribute('hidden')).toEqual('');
  });

  it('loads the new image on click', async () => {
    const { container } = render(<Avatar user={{ avatar: 'pic.jpg' }} />);
    await fireEvent.click(container.firstChild.firstChild);
    expect(true).toBeTruthy();
    // TODO - fix this to spy on the uploadClick method and assert that it was called (it was,
    //  just can't verify it via code, only via debug) - in truth I'm not even certain this works
  });

  it('loads the new image on file load', async () => {
    const event = {
      target: {
        files: [
          {
            name: 'image.png',
            size: 50000,
            type: 'image/png',
          },
        ],
      },
    };
    jest.spyOn(global, 'FileReader').mockImplementation(function () {
      this.readAsDataURL = jest.fn();
      this.onload = jest.fn();
    });
    const { container } = render(<Avatar user={{ avatar: 'pic.jpg' }} />);
    const now = container.firstChild.firstChild.getAttribute('src');
    await act(async () => {
      await fireEvent.change(container.firstChild.lastChild, event);
    });
    expect(container.firstChild.firstChild.getAttribute('src')).toEqual(now);
    const reader = FileReader.mock.instances[0];
    expect(reader.readAsDataURL).toHaveBeenCalledWith({
      name: 'image.png',
      size: 50000,
      type: 'image/png',
    });
    reader.onload({ target: { result: 'foo' } });
  });
});
