import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import Avatar from './Avatar';

Enzyme.configure({ adapter: new Adapter() });

describe('avatar', () => {
  it('renders an empty circle without an user information', () => {
    const { container } = render(<Avatar />);
    expect(container.children).toHaveLength(2);

    expect(container.firstChild.children).toHaveLength(0);
    expect(container.firstChild).toHaveClass('rounded-circle');
    expect(container.firstChild.getAttribute('id')).toEqual('avatar');

    expect(container.lastChild.children).toHaveLength(0);
    expect(container.lastChild.getAttribute('id')).toEqual('initials');
    expect(container.lastChild).toHaveTextContent('');
  });

  it('renders a circle with initial with an user information', async () => {
    const { container } = render(
      <Avatar firstname="Max" lastname="Saperstone" />
    );
    expect(container.children).toHaveLength(2);

    expect(container.firstChild.children).toHaveLength(0);
    expect(container.firstChild).toHaveClass('rounded-circle');
    expect(container.firstChild.getAttribute('id')).toEqual('avatar');

    expect(container.lastChild.children).toHaveLength(0);
    expect(container.lastChild.getAttribute('id')).toEqual('initials');
    expect(container.lastChild).toHaveTextContent('MS');
  });

  it('allows clicking on the initials', () => {
    let x = 0;
    const updateX = () => {
      x++;
    };
    const { container } = render(
      <Avatar firstname="Max" lastname="Saperstone" onClick={updateX} />
    );
    fireEvent.click(container.firstChild);
    expect(x).toEqual(1);
  });

  it('allows clicking on the span', () => {
    let x = 0;
    const updateX = () => {
      x++;
    };
    const { container } = render(
      <Avatar firstname="Max" lastname="Saperstone" onClick={updateX} />
    );
    fireEvent.click(container.lastChild);
    expect(x).toEqual(1);
  });

  it('renders the avatar image with an avatar data', () => {
    const { container } = render(<Avatar avatar="pic.jpg" />);
    expect(container.children).toHaveLength(1);

    expect(container.firstChild.children).toHaveLength(0);
    expect(container.firstChild).toHaveClass('rounded-circle');
    expect(container.firstChild.getAttribute('id')).toEqual('avatar');
    expect(container.firstChild.getAttribute('src')).toEqual('pic.jpg');
  });

  it('allows clicking on the image', () => {
    let x = 0;
    const updateX = () => {
      x++;
    };
    const { container } = render(<Avatar avatar="pic.jpg" onClick={updateX} />);
    fireEvent.click(container.firstChild);
    expect(x).toEqual(1);
  });
});
