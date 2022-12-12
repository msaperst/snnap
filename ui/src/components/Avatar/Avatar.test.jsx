import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from './Avatar';

describe('avatar', () => {
  let x;
  const updateX = () => {
    x++;
  };

  beforeEach(() => {
    x = 0;
  });

  it('renders an empty circle without an user information', () => {
    const { container } = render(<Avatar />);
    expect(container.children).toHaveLength(1);

    expect(container.lastChild.children).toHaveLength(1);
    expect(container.lastChild).toHaveClass('circle initials');
    expect(container.lastChild).toHaveTextContent('');
  });

  it('renders a circle with initial with an user information', async () => {
    const { container } = render(
      <Avatar firstname="Max" lastname="Saperstone" />
    );
    expect(container.children).toHaveLength(1);

    expect(container.lastChild.children).toHaveLength(1);
    expect(container.lastChild).toHaveClass('circle initials');
    expect(container.lastChild.getAttribute('style')).toBeNull();
    expect(container.lastChild).toHaveTextContent('MS');
  });

  it('allows clicking on the initials', () => {
    const { container } = render(
      <Avatar firstname="Max" lastname="Saperstone" onClick={updateX} />
    );
    expect(container.lastChild.getAttribute('style')).toEqual(
      'cursor: pointer;'
    );
    fireEvent.click(container.firstChild);
    expect(x).toEqual(1);
  });

  it('allows clicking on the span', () => {
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
    expect(container.firstChild).toHaveClass('circle');
    expect(container.firstChild.getAttribute('style')).toEqual(
      'background-image: url(pic.jpg);'
    );
  });

  it('renders the avatar image with an avatar data and click', () => {
    const { container } = render(<Avatar avatar="pic.jpg" onClick={updateX} />);
    expect(container.children).toHaveLength(1);

    expect(container.firstChild.children).toHaveLength(0);
    expect(container.firstChild).toHaveClass('circle');
    expect(container.firstChild.getAttribute('style')).toEqual(
      'cursor: pointer; background-image: url(pic.jpg);'
    );
  });

  it('allows clicking on the image', () => {
    const { container } = render(<Avatar avatar="pic.jpg" onClick={updateX} />);
    fireEvent.click(container.firstChild);
    expect(x).toEqual(1);
  });
});
