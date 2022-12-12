import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import SnnapFormTextarea from './SnnapFormTextarea';

describe('snnap form textarea', () => {
  // basic input field data
  it('displays nothing when no name is provided', () => {
    const { container } = render(<SnnapFormTextarea />);
    expect(container.firstChild).toBeNull();
  });

  it('defaults to a 12 column field with 1 child', () => {
    const { container } = render(<SnnapFormTextarea name="123" />);
    expect(container.firstChild).toHaveClass('col-md-12');
    expect(container.firstChild.children).toHaveLength(1);
  });

  it('uses a digit column field when provided', () => {
    const { container } = render(<SnnapFormTextarea size={5} name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses a string column field when provided', () => {
    const { container } = render(<SnnapFormTextarea size="5" name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('is wrapped in a form float', () => {
    const { container } = render(<SnnapFormTextarea size="5" name="123" />);
    expect(container.firstChild.firstChild).toHaveClass('form-floating');
  });

  it('has a label and input', () => {
    const { container } = render(<SnnapFormTextarea size="5" name="123" />);
    expect(container.firstChild.firstChild.children).toHaveLength(3);
  });

  it('uses an onchange when provided', () => {
    let x = 0;
    let y = 0;
    const updateX = (key, value) => {
      x = key;
      y = value;
    };
    const { getByRole } = render(
      <SnnapFormTextarea name="123" onChange={updateX} />
    );
    const event = {
      preventDefault() {},
      target: { value: '1234' },
    };
    fireEvent.change(getByRole('textbox'), event);
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
    const { getByRole } = render(
      <SnnapFormTextarea name="123" id="someId" onChange={updateX} />
    );
    const event = {
      preventDefault() {},
      target: { value: '1234' },
    };
    fireEvent.change(getByRole('textbox'), event);
    expect(x).toEqual('someId');
    expect(y).toEqual('1234');
  });

  it('has a custom id when provided', () => {
    const { container } = render(<SnnapFormTextarea name="123" id="someId" />);
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('someId');
  });

  it('is required when not specified', () => {
    const { container } = render(<SnnapFormTextarea name="123" />);
    expect(container.firstChild.firstChild.firstChild).toBeRequired();
  });

  it('is not required when specified', () => {
    const { container } = render(<SnnapFormTextarea name="123" notRequired />);
    expect(container.firstChild.firstChild.firstChild).not.toBeRequired();
  });

  it('has a textarea field input', () => {
    const { container } = render(
      <SnnapFormTextarea name="123 456-_!@#$%^&':;,./<>?" />
    );
    expect(container.firstChild.firstChild.firstChild).toHaveClass(
      'form-control'
    );
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('form123456_');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('placeholder')
    ).toEqual("123 456-_!@#$%^&':;,./<>?");
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('type')
    ).toBeNull();
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('style')
    ).toEqual('height: 2px;');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('onChange')
    ).toBeNull();
    expect(container.firstChild.firstChild.firstChild).toBeRequired();
  });

  it('has an error field', () => {
    const { container } = render(<SnnapFormTextarea name="123" />);
    expect(container.firstChild.firstChild.children[1]).toHaveClass(
      'invalid-feedback'
    );
    expect(container.firstChild.firstChild.children[1]).toHaveTextContent(
      'Please provide a valid 123.'
    );
  });

  it('has a label', () => {
    const { container } = render(<SnnapFormTextarea name="123" />);
    expect(
      container.firstChild.firstChild.lastChild.getAttribute('for')
    ).toEqual('form123');
    expect(container.firstChild.firstChild.lastChild).toHaveTextContent('123');
  });

  it('starts with some text already in it', () => {
    const { container } = render(
      <SnnapFormTextarea name="123" value="hi there" />
    );
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('style')
    ).toEqual('height: 2px;');
  });

  it('get larger with some text added to it', async () => {
    const { getByRole } = render(<SnnapFormTextarea name="123" />);
    const textarea = getByRole('textbox');
    const event = {
      preventDefault() {},
      target: { value: '1234' },
    };
    await act(async () => {
      fireEvent.change(textarea, event);
    });
    expect(textarea.getAttribute('style')).toEqual('height: 2px;');
    await act(async () => {
      fireEvent.keyDown(textarea, { key: 'Enter' });
    });
    expect(textarea.getAttribute('style')).toEqual('height: 2px;');
  });
});
