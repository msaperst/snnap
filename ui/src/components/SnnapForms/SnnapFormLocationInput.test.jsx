import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SnnapFormLocationInput from './SnnapFormLocationInput';
import { selectFairfax } from '../CommonTestComponents';

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

  it('uses an onchange when provided', async () => {
    let x = 0;
    const updateX = (key, value) => {
      x = value;
    };
    const { container, getByText } = render(
      <SnnapFormLocationInput name="123" onChange={updateX} />
    );
    const input = container.querySelector('input');

    const selectItem = selectFairfax(getByText);
    await selectItem(input);
    expect(input).toHaveValue('Fairfax, VA 20030, United States of America');
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 1000));
    expect(x).not.toEqual(0); // this should equal 'Fairfax'
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
      'Please select a valid 123 from the drop down.'
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
