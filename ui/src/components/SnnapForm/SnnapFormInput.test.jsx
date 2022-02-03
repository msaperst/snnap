import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
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

  it('defaults to a 12 column field with 3 children', () => {
    const { container } = render(<SnnapFormInput name="123" />);
    expect(container.firstChild).toHaveClass('col-md-12');
    expect(container.firstChild.children).toHaveLength(3);
  });

  it('uses a digit column field when provided', () => {
    const { container } = render(<SnnapFormInput size={5} name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses a string column field when provided', () => {
    const { container } = render(<SnnapFormInput size="5" name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses a password input type when provided', () => {
    const { container } = render(<SnnapFormInput name="123" type="password" />);
    expect(container.firstChild.children[1].getAttribute('type')).toEqual(
      'password'
    );
  });

  // singular input, no group
  it('has a label', () => {
    const { container } = render(<SnnapFormInput name="123" />);
    expect(container.firstChild.firstChild).toHaveClass('form-label');
    expect(container.firstChild.firstChild.getAttribute('for')).toEqual(
      'validation123'
    );
    expect(container.firstChild.firstChild).toHaveTextContent('123');
  });

  it('does not have group input', () => {
    const { container } = render(<SnnapFormInput name="123" />);
    expect(container.firstChild.children[1].children).toHaveLength(0);
  });

  it('has an input field input', () => {
    const { container } = render(<SnnapFormInput name="123" />);
    expect(container.firstChild.children[1]).toHaveClass('form-control');
    expect(container.firstChild.children[1].getAttribute('id')).toEqual(
      'validation123'
    );
    expect(
      container.firstChild.children[1].getAttribute('placeholder')
    ).toEqual('123');
    expect(container.firstChild.children[1].getAttribute('type')).toEqual(
      'text'
    );
    expect(container.firstChild.children[1]).toBeRequired();
  });

  it('has an error field', () => {
    const { container } = render(<SnnapFormInput name="123" />);
    // expect(container.firstChild.children[1].children[1]).toEqual('');
    expect(container.firstChild.children[2]).toHaveClass('invalid-feedback');
    expect(container.firstChild.children[2]).toHaveTextContent(
      'Please provide a valid 123.'
    );
  });

  // before provided, with group
  it('has 3 children with before', () => {
    const { container } = render(<SnnapFormInput name="123" before="#" />);
    expect(container.firstChild.children).toHaveLength(2);
  });

  it('has a label with before', () => {
    const { container } = render(<SnnapFormInput name="123" before="#" />);
    expect(container.firstChild.firstChild).toHaveClass('form-label');
    expect(container.firstChild.firstChild.getAttribute('for')).toEqual(
      'validation123'
    );
    expect(container.firstChild.firstChild).toHaveTextContent('123');
  });

  it('has a group input with before', () => {
    const { container } = render(<SnnapFormInput name="123" before="#" />);
    expect(container.firstChild.children[1].children).toHaveLength(3);
    expect(container.firstChild.children[1]).toHaveClass(
      'input-group has-validation'
    );
  });

  it('has a prepend field with before', () => {
    const { container } = render(<SnnapFormInput name="123" before="#" />);
    expect(container.firstChild.children[1].firstChild).toHaveClass(
      'input-group-text'
    );
    expect(
      container.firstChild.children[1].firstChild.getAttribute('id')
    ).toEqual('inputGroup123');
    expect(container.firstChild.children[1].firstChild).toHaveTextContent('#');
  });

  it('has an input field input with before', () => {
    const { container } = render(<SnnapFormInput name="123" before="#" />);
    expect(container.firstChild.children[1].children[1]).toHaveClass(
      'form-control'
    );
    expect(
      container.firstChild.children[1].children[1].getAttribute('id')
    ).toEqual('validation123');
    expect(
      container.firstChild.children[1].children[1].getAttribute('placeholder')
    ).toEqual('123');
    expect(
      container.firstChild.children[1].children[1].getAttribute('type')
    ).toEqual('text');
    expect(container.firstChild.children[1].children[1]).toBeRequired();
  });

  it('has an error field with before', () => {
    const { container } = render(<SnnapFormInput name="123" before="#" />);
    // expect(container.firstChild.children[1].children[1]).toEqual('');
    expect(container.firstChild.children[1].children[2]).toHaveClass(
      'invalid-feedback'
    );
    expect(container.firstChild.children[1].children[2]).toHaveTextContent(
      'Please provide a valid 123.'
    );
  });

  // after provided, with group
  it('has 3 children with after', () => {
    const { container } = render(<SnnapFormInput name="123" after="#" />);
    expect(container.firstChild.children).toHaveLength(2);
  });

  it('has a label with after', () => {
    const { container } = render(<SnnapFormInput name="123" after="#" />);
    expect(container.firstChild.firstChild).toHaveClass('form-label');
    expect(container.firstChild.firstChild.getAttribute('for')).toEqual(
      'validation123'
    );
    expect(container.firstChild.firstChild).toHaveTextContent('123');
  });

  it('has a group input with after', () => {
    const { container } = render(<SnnapFormInput name="123" after="#" />);
    expect(container.firstChild.children[1].children).toHaveLength(3);
    expect(container.firstChild.children[1]).toHaveClass(
      'input-group has-validation'
    );
  });

  it('has an input field input with after', () => {
    const { container } = render(<SnnapFormInput name="123" after="#" />);
    expect(container.firstChild.children[1].children[0]).toHaveClass(
      'form-control'
    );
    expect(
      container.firstChild.children[1].children[0].getAttribute('id')
    ).toEqual('validation123');
    expect(
      container.firstChild.children[1].children[0].getAttribute('placeholder')
    ).toEqual('123');
    expect(
      container.firstChild.children[1].children[0].getAttribute('type')
    ).toEqual('text');
    expect(container.firstChild.children[1].children[0]).toBeRequired();
  });

  it('has a append field with after', () => {
    const { container } = render(<SnnapFormInput name="123" after="#" />);
    expect(container.firstChild.children[1].children[1]).toHaveClass(
      'input-group-text'
    );
    expect(
      container.firstChild.children[1].children[1].getAttribute('id')
    ).toEqual('inputGroup123');
    expect(container.firstChild.children[1].children[1]).toHaveTextContent('#');
  });

  it('has an error field with after', () => {
    const { container } = render(<SnnapFormInput name="123" after="#" />);
    // expect(container.firstChild.children[1].children[2]).toEqual('');
    expect(container.firstChild.children[1].children[2]).toHaveClass(
      'invalid-feedback'
    );
    expect(container.firstChild.children[1].children[2]).toHaveTextContent(
      'Please provide a valid 123.'
    );
  });
});
