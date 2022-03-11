import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SnnapFormInput from './SnnapFormInput';

Enzyme.configure({ adapter: new Adapter() });

describe('snnap form input', () => {
  // basic input field data
  it('displays nothing when no name is provided', () => {
    const { container } = render(<SnnapFormInput />);
    expect(container.firstChild).toBeNull();
  });

  it('defaults to a 12 column field with 1 child', () => {
    const { container } = render(<SnnapFormInput name="123" />);
    expect(container.firstChild).toHaveClass('col-md-12');
    expect(container.firstChild.children).toHaveLength(1);
  });

  it('uses a digit column field when provided', () => {
    const { container } = render(<SnnapFormInput size={5} name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses a string column field when provided', () => {
    const { container } = render(<SnnapFormInput size="5" name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('is wrapped in a form float', () => {
    const { container } = render(<SnnapFormInput size="5" name="123" />);
    expect(container.firstChild.firstChild).toHaveClass('form-floating');
  });

  it('has a label and input', () => {
    const { container } = render(<SnnapFormInput size="5" name="123" />);
    expect(container.firstChild.firstChild.children).toHaveLength(3);
  });

  it('uses a password input type when provided', () => {
    const { container } = render(<SnnapFormInput name="123" type="password" />);
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('password');
  });

  it('becomes a textarea when specified', () => {
    const { container } = render(<SnnapFormInput name="123" type="textarea" />);
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('textarea');
  });

  it('uses an onchange when provided', () => {
    let x = 0;
    let y = 0;
    const updateX = (key, value) => {
      x = key;
      y = value;
    };
    const component = mount(<SnnapFormInput name="123" onChange={updateX} />);
    const event = {
      preventDefault() {},
      target: { value: '1234' },
    };
    component.find('.form-control').simulate('change', event);
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
    const component = mount(
      <SnnapFormInput name="123" id="someId" onChange={updateX} />
    );
    const event = {
      preventDefault() {},
      target: { value: '1234' },
    };
    component.find('.form-control').simulate('change', event);
    expect(x).toEqual('someId');
    expect(y).toEqual('1234');
  });

  it('has a custom id when provided', () => {
    const { container } = render(<SnnapFormInput name="123" id="someId" />);
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('someId');
  });

  it('has an input field input', () => {
    const { container } = render(<SnnapFormInput name="123" />);
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
    ).toEqual('text');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('onChange')
    ).toBeNull();
    expect(container.firstChild.firstChild.firstChild).toBeRequired();
  });

  it('has an error field', () => {
    const { container } = render(<SnnapFormInput name="123" />);
    expect(container.firstChild.firstChild.children[1]).toHaveClass(
      'invalid-feedback'
    );
    expect(container.firstChild.firstChild.children[1]).toHaveTextContent(
      'Please provide a valid 123.'
    );
  });

  it('has a label', () => {
    const { container } = render(<SnnapFormInput name="123" />);
    expect(
      container.firstChild.firstChild.lastChild.getAttribute('for')
    ).toEqual('form123');
    expect(container.firstChild.firstChild.lastChild).toHaveTextContent('123');
  });
});
