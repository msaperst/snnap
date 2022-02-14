import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SnnapFormMultiSelect from './SnnapFormMultiSelect';

Enzyme.configure({ adapter: new Adapter() });

describe('snnap form input', () => {
  let child;

  beforeEach(async () => {
    const { container } = render(
      <SnnapFormMultiSelect name="123" options={['Option 1', 'Option 2']} />
    );
    child = await waitFor(() => container.firstChild);
  });

  it('displays nothing when no name is provided', () => {
    const { container } = render(<SnnapFormMultiSelect />);
    expect(container.firstChild).toBeNull();
  });

  it('displays nothing when no options are provided', () => {
    const { container } = render(<SnnapFormMultiSelect name="123" />);
    expect(container.firstChild).toBeNull();
  });

  it('displays nothing when empty options are provided', () => {
    const { container } = render(
      <SnnapFormMultiSelect name="123" options="" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('defaults to a 12 column field with 1 child', () => {
    expect(child).toHaveClass('col-md-12');
    expect(child.children).toHaveLength(1);
  });

  it('uses a digit column field when provided', () => {
    const { container } = render(
      <SnnapFormMultiSelect
        size={5}
        name="123"
        options={['Option 1', 'Option 2']}
      />
    );
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses a string column field when provided', () => {
    const { container } = render(
      <SnnapFormMultiSelect
        size="5"
        name="123"
        options={['Option 1', 'Option 2']}
      />
    );
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses an onchange when provided', async () => {
    const { container } = render(
      <SnnapFormMultiSelect
        name="123"
        options={['Option 1', 'Option 2']}
        onChange="method"
      />
    );
    const child = await waitFor(() => container.firstChild);
    expect(child.firstChild.getAttribute('class')).toContain('-container');
  });

  it('is wrapped in a container group', () => {
    expect(child.firstChild.getAttribute('class')).toContain('-container');
  });

  it('has our placeholder', () => {
    expect(
      child.firstChild.children[2].firstChild.firstChild
    ).toHaveTextContent('123');
  });

  // TODO test out options are displayed, and that when clicked, they are added to the element
});
