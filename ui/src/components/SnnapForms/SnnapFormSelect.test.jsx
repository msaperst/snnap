import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SnnapFormSelect from './SnnapFormSelect';

describe('snnap form input', () => {
  let child;

  beforeEach(async () => {
    const { container } = render(
      <SnnapFormSelect name="123" options={['Option 1', 'Option 2']} />
    );
    child = await waitFor(() => container.firstChild);
  });

  it('displays nothing when no name is provided', () => {
    const { container } = render(<SnnapFormSelect />);
    expect(container.firstChild).toBeNull();
  });

  it('displays nothing when no options are provided', () => {
    const { container } = render(<SnnapFormSelect name="123" />);
    expect(container.firstChild).toBeNull();
  });

  it('displays nothing when empty options are provided', () => {
    const { container } = render(<SnnapFormSelect name="123" options="" />);
    expect(container.firstChild).toBeNull();
  });

  it('defaults to a 12 column field with 1 child', () => {
    expect(child).toHaveClass('col-md-12');
    expect(child.children).toHaveLength(1);
  });

  it('uses a digit column field when provided', () => {
    const { container } = render(
      <SnnapFormSelect size={5} options={['Option 1', 'Option 2']} name="123" />
    );
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses a string column field when provided', () => {
    const { container } = render(
      <SnnapFormSelect size="5" options={['Option 1', 'Option 2']} name="123" />
    );
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('is wrapped in a form float', () => {
    expect(child.firstChild).toHaveClass('form-floating');
  });

  it('has a label and input', () => {
    expect(child.firstChild.children).toHaveLength(3);
  });

  it('uses an onchange when provided', () => {
    const { container } = render(
      <SnnapFormSelect
        name="123"
        options={['Option 1', 'Option 2']}
        onChange="method"
      />
    );
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('form123');
  });

  it('has an input field input', () => {
    expect(child.firstChild.firstChild).toHaveClass('form-select');
    expect(child.firstChild.firstChild.getAttribute('id')).toEqual('form123');
    expect(child.firstChild.firstChild.getAttribute('placeholder')).toBeNull();
    expect(child.firstChild.firstChild.getAttribute('onChange')).toBeNull();
    expect(child.firstChild.firstChild).toBeRequired();
  });

  it('has an error field', () => {
    expect(child.firstChild.children[1]).toHaveClass('invalid-feedback');
    expect(child.firstChild.children[1]).toHaveTextContent(
      'Please provide a valid 123.'
    );
  });

  it('has a label', () => {
    expect(child.firstChild.lastChild.getAttribute('for')).toEqual('form123');
    expect(child.firstChild.lastChild).toHaveTextContent('123');
  });
});
