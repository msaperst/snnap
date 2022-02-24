import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SnnapFormPrice from './SnnapFormPrice';

Enzyme.configure({ adapter: new Adapter() });

describe('snnap form input', () => {
  // basic input field data
  it('displays nothing when no name is provided', () => {
    const { container } = render(<SnnapFormPrice />);
    expect(container.firstChild).toBeNull();
  });

  it('defaults to a 12 column field with 1 child', () => {
    const { container } = render(<SnnapFormPrice name="123" />);
    expect(container.firstChild).toHaveClass('col-md-12');
    expect(container.firstChild.children).toHaveLength(1);
  });

  it('uses a digit column field when provided', () => {
    const { container } = render(<SnnapFormPrice size={5} name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses a string column field when provided', () => {
    const { container } = render(<SnnapFormPrice size="5" name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('is wrapped in a form float', () => {
    const { container } = render(<SnnapFormPrice size="5" name="123" />);
    expect(container.firstChild.firstChild).toHaveClass(
      'input-group has-validation'
    );
  });

  it('has a label and inputs', () => {
    const { container } = render(<SnnapFormPrice size="5" name="123" />);
    expect(container.firstChild.firstChild.children).toHaveLength(4);
  });

  it('uses an onchange when provided', () => {
    let x = 0;
    let y = 0;
    const updateX = (key, value) => {
      x = key;
      y = value;
    };
    const component = mount(<SnnapFormPrice name="123" onChange={updateX} />);
    const event = {
      preventDefault() {},
      target: { value: '1234' },
    };
    component.find('.form-control').simulate('change', event);
    expect(x).toEqual('123');
    expect(y).toEqual('1234');
  });

  it('has a $', () => {
    const { container } = render(<SnnapFormPrice name="123" />);
    expect(container.firstChild.firstChild.firstChild).toHaveClass(
      'input-group-text'
    );
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('inputGroupPre123');
    expect(container.firstChild.firstChild.firstChild).toHaveTextContent('$');
  });

  it('has an input field input', () => {
    const { container } = render(<SnnapFormPrice name="123" />);
    expect(container.firstChild.firstChild.children[1]).toHaveClass(
      'form-control'
    );
    expect(
      container.firstChild.firstChild.children[1].getAttribute('id')
    ).toEqual('form123');
    expect(
      container.firstChild.firstChild.children[1].getAttribute('placeholder')
    ).toEqual('123');
    expect(
      container.firstChild.firstChild.children[1].getAttribute('type')
    ).toEqual('number');
    expect(
      container.firstChild.firstChild.children[1].getAttribute('step')
    ).toEqual('0.01');
    expect(
      container.firstChild.firstChild.children[1].getAttribute('min')
    ).toEqual('0');
    expect(
      container.firstChild.firstChild.children[1].getAttribute('onChange')
    ).toBeNull();
    expect(container.firstChild.firstChild.children[1]).toBeRequired();
  });

  it('has a per hour label', () => {
    const { container } = render(<SnnapFormPrice name="123" />);
    expect(container.firstChild.firstChild.children[2]).toHaveClass(
      'input-group-text'
    );
    expect(
      container.firstChild.firstChild.children[2].getAttribute('id')
    ).toEqual('inputGroupPost123');
    expect(container.firstChild.firstChild.children[2]).toHaveTextContent(
      'Per Hour'
    );
  });

  it('has an error field', () => {
    const { container } = render(<SnnapFormPrice name="123" />);
    expect(container.firstChild.firstChild.lastChild).toHaveClass(
      'invalid-feedback'
    );
    expect(container.firstChild.firstChild.lastChild).toHaveTextContent(
      'Please provide a valid 123.'
    );
  });
});
