import React from 'react';
import { fireEvent, getByText, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SnnapFormInputWithDropdown from './SnnapFormInputWithDropdown';

describe('snnap form input', () => {
  let child;

  beforeEach(async () => {
    const { container } = render(
      <SnnapFormInputWithDropdown
        name="123"
        options={['Option 1', 'Option 2']}
      />
    );
    child = await waitFor(() => container.firstChild);
  });

  // basic input field data
  it('displays nothing when no name is provided', () => {
    const { container } = render(<SnnapFormInputWithDropdown />);
    expect(container.firstChild).toBeNull();
  });

  it('displays nothing when no options are provided', () => {
    const { container } = render(<SnnapFormInputWithDropdown name="123" />);
    expect(container.firstChild).toBeNull();
  });

  it('displays nothing when empty options are provided', () => {
    const { container } = render(
      <SnnapFormInputWithDropdown name="123" options="" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('defaults to a 12 column field with 1 child', () => {
    expect(child).toHaveClass('col-md-12');
    expect(child.children).toHaveLength(1);
  });

  it('uses a digit column field when provided', async () => {
    const { container } = render(
      <SnnapFormInputWithDropdown
        size={5}
        name="123"
        options={['Option 1', 'Option 2']}
      />
    );
    const child = await waitFor(() => container.firstChild);
    expect(child).toHaveClass('col-md-5');
  });

  it('uses a string column field when provided', async () => {
    const { container } = render(
      <SnnapFormInputWithDropdown
        size="5"
        name="123"
        options={['Option 1', 'Option 2']}
      />
    );
    const child = await waitFor(() => container.firstChild);
    expect(child).toHaveClass('col-md-5');
  });

  it('is wrapped in an input group', () => {
    expect(child.firstChild).toHaveClass('input-group has-validation');
  });

  it('has a label and input', () => {
    expect(child.firstChild.children).toHaveLength(4);
  });

  it('uses an onchange when provided', async () => {
    const { container } = render(
      <SnnapFormInputWithDropdown
        name="123"
        options={['Option 1', 'Option 2']}
        onChange="method"
      />
    );
    const child = await waitFor(() => container.firstChild);
    expect(child.firstChild.firstChild.getAttribute('id')).toEqual('form123');
  });

  it('has an input field input', () => {
    expect(child.firstChild.firstChild).toHaveClass('form-control');
    expect(child.firstChild.firstChild.getAttribute('id')).toEqual('form123');
    expect(child.firstChild.firstChild.getAttribute('placeholder')).toEqual(
      '123'
    );
    expect(child.firstChild.firstChild.getAttribute('type')).toEqual('text');
    expect(child.firstChild.firstChild.getAttribute('onChange')).toBeNull();
    expect(child.firstChild.firstChild).toBeRequired();
  });

  it('has an error field', () => {
    expect(child.firstChild.children[1]).toHaveClass('invalid-feedback');
    expect(child.firstChild.children[1]).toHaveTextContent(
      'Please provide a valid 123.'
    );
  });

  it('has a drop down button', () => {
    expect(child.firstChild.children[2]).toHaveClass(
      'dropdown-toggle btn btn-outline-primary'
    );
    expect(child.firstChild.children[2].getAttribute('aria-expanded')).toEqual(
      'false'
    );
    expect(child.firstChild.children[2].getAttribute('id')).toEqual(
      'dropDown123'
    );
    expect(child.firstChild.children[2].getAttribute('type')).toEqual('button');
    expect(child.firstChild.children[2]).toHaveTextContent('123');
  });

  it('has drop down options', () => {
    expect(child.firstChild.lastChild).toHaveClass(
      'dropdown-menu dropdown-menu-end'
    );
    expect(child.firstChild.lastChild.getAttribute('aria-labelledby')).toEqual(
      'dropDown123'
    );
    expect(child.firstChild.lastChild.children).toHaveLength(2);
  });

  it('has each drop down option', () => {
    for (let i = 0; i < 2; i++) {
      expect(child.firstChild.lastChild.children[i]).toHaveClass(
        'dropdown-item'
      );
      expect(
        child.firstChild.lastChild.children[i].getAttribute('role')
      ).toEqual('button');
      expect(
        child.firstChild.lastChild.children[i].getAttribute('tabindex')
      ).toEqual('0');
      expect(child.firstChild.lastChild.children[i]).toHaveTextContent(
        `Option ${i + 1}`
      );
    }
  });

  it('changes value on select', async () => {
    const { container } = render(
      <SnnapFormInputWithDropdown
        name="123"
        options={['Option 1', 'Option 2']}
      />
    );
    await waitFor(() => container.firstChild);
    expect(child.firstChild.children[2]).toHaveTextContent('123');
    const button = getByText(container, 'Option 1');
    fireEvent.click(button);
    expect(child.firstChild.children[2]).toHaveTextContent('Option 1');
  });

  it('fires the on change on select', async () => {
    let x = 0;
    const updateX = (key, value) => {
      x = value;
    };
    const { container } = render(
      <SnnapFormInputWithDropdown
        name="123"
        options={['Option 1', 'Option 2']}
        onChange={updateX}
      />
    );
    await waitFor(() => container.firstChild);
    expect(child.firstChild.children[2]).toHaveTextContent('123');
    const button = getByText(container, 'Option 1');
    fireEvent.click(button);
    expect(child.firstChild.children[2]).toHaveTextContent('Option 1');
    expect(x).toEqual('Option 1');
  });
});
