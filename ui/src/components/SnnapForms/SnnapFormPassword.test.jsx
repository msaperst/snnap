import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import SnnapFormPassword from './SnnapFormPassword';

describe('snnap form input', () => {
  // basic input field data
  it('displays nothing when no name is provided', () => {
    const { container } = render(<SnnapFormPassword />);
    expect(container.firstChild).toBeNull();
  });

  it('defaults to a 12 column field with 1 child', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    expect(container.firstChild).toHaveClass('col-md-12');
    expect(container.firstChild.children).toHaveLength(1);
  });

  it('uses a digit column field when provided', () => {
    const { container } = render(<SnnapFormPassword size={5} name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses a string column field when provided', () => {
    const { container } = render(<SnnapFormPassword size="5" name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('is wrapped in a form float', () => {
    const { container } = render(<SnnapFormPassword size="5" name="123" />);
    expect(container.firstChild.firstChild).toHaveClass('form-floating');
  });

  it('has a label, input, and strength', () => {
    const { container } = render(<SnnapFormPassword size="5" name="123" />);
    expect(container.firstChild.firstChild.children).toHaveLength(4);
  });

  it('uses an onchange when provided', () => {
    let x = 0;
    let y = 0;
    const updateX = (key, value) => {
      x = key;
      y = value;
    };
    const { getByLabelText } = render(
      <SnnapFormPassword name="123" onChange={updateX} />
    );
    const event = {
      preventDefault() {},
      target: { value: '1234' },
    };
    fireEvent.change(getByLabelText('123'), event);
    expect(x).toEqual('123');
    expect(y).toEqual('1234');
  });

  it('uses a custom key on onchange when provided', () => {
    let x = 0;
    let y = 0;
    const updateX = (key, value) => {
      x = key;
      y = value;
    };
    const { getByLabelText } = render(
      <SnnapFormPassword name="123" id="someId" onChange={updateX} />
    );
    const event = {
      preventDefault() {},
      target: { value: '1234' },
    };
    fireEvent.change(getByLabelText('123'), event);
    expect(x).toEqual('someId');
    expect(y).toEqual('1234');
  });

  it('stays red below 6 characters', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    const strength = container.firstChild.firstChild.firstChild;
    act(() => {
      fireEvent.change(strength, { target: { value: 'abcde' } });
    });
    expect(
      container.firstChild.firstChild.children[1].getAttribute('style')
    ).toEqual(
      'height: 10px; background-color: rgb(255, 0, 0); width: 15.625%;'
    );
  });

  it('turns orange at 6', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    const strength = container.firstChild.firstChild.firstChild;
    act(() => {
      fireEvent.change(strength, { target: { value: 'abcdef' } });
    });
    expect(
      container.firstChild.firstChild.children[1].getAttribute('style')
    ).toEqual(
      'height: 10px; background-color: rgb(255, 68, 0); width: 18.75%;'
    );
  });

  it('stays orange at 17', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    const strength = container.firstChild.firstChild.firstChild;
    act(() => {
      fireEvent.change(strength, { target: { value: 'abcdefghijklmnop' } });
    });
    expect(
      container.firstChild.firstChild.children[1].getAttribute('style')
    ).toEqual('height: 10px; background-color: rgb(255, 238, 0); width: 50%;');
  });

  it('turns green at 18', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    const strength = container.firstChild.firstChild.firstChild;
    act(() => {
      fireEvent.change(strength, { target: { value: 'abcdefghijklmnopq' } });
    });
    expect(
      container.firstChild.firstChild.children[1].getAttribute('style')
    ).toEqual(
      'height: 10px; background-color: rgb(255, 255, 0); width: 53.125%;'
    );
  });

  it('all green at 32', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    const strength = container.firstChild.firstChild.firstChild;
    act(() => {
      fireEvent.change(strength, {
        target: { value: 'abcdefghijklmnopqrstuvwxyzabcdef' },
      });
    });
    expect(
      container.firstChild.firstChild.children[1].getAttribute('style')
    ).toEqual('height: 10px; background-color: rgb(0, 255, 0); width: 100%;');
  });

  it('maxes out at 32', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    const strength = container.firstChild.firstChild.firstChild;
    act(() => {
      fireEvent.change(strength, {
        target: { value: 'abcdefghijklmnopqrstuvwxyzabcdefg' },
      });
    });
    expect(
      container.firstChild.firstChild.children[1].getAttribute('style')
    ).toEqual('height: 10px; background-color: rgb(0, 255, 0); width: 100%;');
  });

  it('has a custom id when provided', () => {
    const { container } = render(<SnnapFormPassword name="123" id="someId" />);
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('someId');
  });

  it('is required when not specified', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    expect(container.firstChild.firstChild.firstChild).toBeRequired();
  });

  it('has an input field input', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    expect(container.firstChild.firstChild.firstChild).toHaveClass(
      'form-control'
    );
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('form123');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('placeholder')
    ).toEqual('123');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('password');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('onChange')
    ).toBeNull();
    expect(container.firstChild.firstChild.firstChild).toBeRequired();
  });

  it('has a strength field', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    expect(
      container.firstChild.firstChild.children[1].getAttribute('style')
    ).toEqual('height: 10px; background-color: rgb(255, 0, 0); width: 0px;');
  });

  it('has an error field', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    expect(container.firstChild.firstChild.children[2]).toHaveClass(
      'invalid-feedback'
    );
    expect(container.firstChild.firstChild.children[2]).toHaveTextContent(
      'Password must be 6 or more characters.'
    );
  });

  it('has a label', () => {
    const { container } = render(<SnnapFormPassword name="123" />);
    expect(
      container.firstChild.firstChild.lastChild.getAttribute('for')
    ).toEqual('form123');
    expect(container.firstChild.firstChild.lastChild).toHaveTextContent('123');
  });
});
