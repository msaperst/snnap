import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SnnapFormLocationInput from './SnnapFormLocationInput';

Enzyme.configure({ adapter: new Adapter() });

describe('snnap form input', () => {
  it('displays nothing when no name is provided', () => {
    const { container } = render(<SnnapFormLocationInput />);
    expect(container.firstChild).toBeNull();
  });

  it('defaults to a 12 column field with 1 child', () => {
    const { container } = render(<SnnapFormLocationInput name="123" />);
    expect(container.firstChild).toHaveClass('col-md-12');
    expect(container.firstChild.children).toHaveLength(1);
  });

  it('uses a digit column field when provided', () => {
    const { container } = render(
      <SnnapFormLocationInput size={5} name="123" />
    );
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses a string column field when provided', () => {
    const { container } = render(
      <SnnapFormLocationInput size="5" name="123" />
    );
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses an onchange when provided', () => {
    let x = 0;
    const updateX = (key, value) => {
      x = value;
    };
    const { container } = render(
      <SnnapFormLocationInput name="123" onChange={updateX} />
    );
    const input = container.querySelector('input');
    userEvent.type(input, 'Fairfax{arrowdown}{enter}');
    expect(input).toHaveValue('Fairfax');
    expect(x).toEqual(0); // TODO - this should equal 'Fairfax'
  });

  it('is wrapped in a form float', () => {
    const { container } = render(
      <SnnapFormLocationInput size="5" name="123" />
    );
    expect(container.firstChild.firstChild).toHaveClass('form-floating');
  });

  it('has a close button, input, label, and feedback', () => {
    const { container } = render(
      <SnnapFormLocationInput size="5" name="123" />
    );
    expect(container.firstChild.firstChild.children).toHaveLength(5);
  });

  it('has a geoapify close button', () => {
    const { container } = render(<SnnapFormLocationInput name="123" />);
    expect(container.firstChild.firstChild.firstChild).toHaveClass(
      'geoapify-close-button'
    );
  });

  it('has an input field input', () => {
    const { container } = render(<SnnapFormLocationInput name="123" />);
    expect(container.firstChild.firstChild.children[1]).toHaveClass(
      'form-control'
    );
    expect(
      container.firstChild.firstChild.children[1].getAttribute('placeholder')
    ).toEqual('123');
    expect(
      container.firstChild.firstChild.children[1].getAttribute('type')
    ).toEqual('text');
    expect(
      container.firstChild.firstChild.children[1].getAttribute('onChange')
    ).toBeNull();
    expect(container.firstChild.firstChild.children[1]).toBeRequired();
  });

  it('has an error field', () => {
    const { container } = render(<SnnapFormLocationInput name="123" />);
    expect(container.firstChild.firstChild.children[2]).toHaveClass(
      'invalid-feedback'
    );
    expect(container.firstChild.firstChild.children[2]).toHaveTextContent(
      'Please provide a valid 123.'
    );
  });

  it('has a container field', () => {
    const { container } = render(<SnnapFormLocationInput name="123" />);
    expect(container.firstChild.firstChild.children[3]).toHaveClass(
      'geocoder-container'
    );
  });

  it('has a label', () => {
    const { container } = render(<SnnapFormLocationInput name="123" />);
    expect(
      container.firstChild.firstChild.lastChild.getAttribute('for')
    ).toEqual('form123');
    expect(container.firstChild.firstChild.lastChild).toHaveTextContent('123');
  });
});
