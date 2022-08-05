import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SnnapFormMultiSelect from './SnnapFormMultiSelect';

Enzyme.configure({ adapter: new Adapter() });

describe('snnap form input', () => {
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

  it('defaults to a 12 column field with 1 child', async () => {
    const { container } = render(
      <SnnapFormMultiSelect name="123" options={['Option 1', 'Option 2']} />
    );
    const child = await waitFor(() => container.firstChild);
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

  // https://stackoverflow.com/questions/55575843/how-to-test-react-select-with-react-testing-library
  const getSelectItem = (getByText) => async (selectLabel, itemText) => {
    fireEvent.keyDown(getByText(selectLabel), { keyCode: 40 });
    await waitFor(() => getByText(itemText));
    fireEvent.click(getByText(itemText));
  };

  it('adds value when onchange is provided', async () => {
    let x = 0;
    const updateX = () => {
      x = 1;
    };
    const { container, getByText } = render(
      <SnnapFormMultiSelect
        name="MyForm"
        options={[
          { id: 1, name: 'Camera' },
          { id: 2, name: 'Lights' },
          { id: 3, name: 'Action' },
          { id: 4, name: 'More' },
        ]}
        onChange={updateX}
      />
    );
    const selectItem = getSelectItem(getByText);
    await selectItem('MyForm', 'Lights');
    expect(x).toEqual(1);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.children
    ).toHaveLength(1);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.firstChild
    ).toHaveTextContent('Lights');
  });

  it('adds value when onchange is not provided', async () => {
    const { container, getByText } = render(
      <SnnapFormMultiSelect
        name="MyForm"
        options={[
          { id: 1, name: 'Camera' },
          { id: 2, name: 'Lights' },
          { id: 3, name: 'Action' },
          { id: 4, name: 'More' },
        ]}
      />
    );
    const selectItem = getSelectItem(getByText);
    await selectItem('MyForm', 'Action');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.children
    ).toHaveLength(1);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.firstChild
    ).toHaveTextContent('Action');
  });

  it('removes value when onchange is provided', async () => {
    let x = 0;
    const updateX = () => {
      x = 1;
    };
    const { container, getByLabelText } = render(
      <SnnapFormMultiSelect
        name="MyForm"
        options={[
          { id: 1, name: 'Camera' },
          { id: 2, name: 'Lights' },
          { id: 3, name: 'Action' },
          { id: 4, name: 'More' },
        ]}
        onChange={updateX}
        values={[{ value: 2 }]}
      />
    );
    const input =
      container.firstChild.firstChild.lastChild.firstChild.firstChild;
    expect(input.children).toHaveLength(1);
    expect(input.firstChild).toHaveTextContent('Lights');
    fireEvent.click(getByLabelText('Remove Lights'));
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 500));
    expect(x).toEqual(1);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.children
    ).toHaveLength(0);
  });

  it('removes value when onchange is not provided', async () => {
    const { container, getByLabelText } = render(
      <SnnapFormMultiSelect
        name="MyForm"
        options={[
          { id: 1, name: 'Camera' },
          { id: 2, name: 'Lights' },
          { id: 3, name: 'Action' },
          { id: 4, name: 'More' },
        ]}
        values={[{ value: 2 }]}
      />
    );
    const input =
      container.firstChild.firstChild.lastChild.firstChild.firstChild;
    expect(input.children).toHaveLength(1);
    expect(input.firstChild).toHaveTextContent('Lights');
    fireEvent.click(getByLabelText('Remove Lights'));
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 500));
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.children
    ).toHaveLength(0);
  });

  it('is wrapped in a container group', async () => {
    const { container } = render(
      <SnnapFormMultiSelect name="123" options={['Option 1', 'Option 2']} />
    );
    const child = await waitFor(() => container.firstChild);
    expect(child.firstChild.getAttribute('class')).toContain('-container');
  });

  it('has our placeholder', async () => {
    const { container } = render(
      <SnnapFormMultiSelect name="123" options={['Option 1', 'Option 2']} />
    );
    const child = await waitFor(() => container.firstChild);
    expect(
      child.firstChild.children[2].firstChild.firstChild
    ).toHaveTextContent('123');
  });

  it('loads initial values provided', async () => {
    const { container } = render(
      <SnnapFormMultiSelect
        name="123"
        options={[
          { id: 1, name: 'Camera' },
          { id: 2, name: 'Lights' },
          { id: 3, name: 'Action' },
          { id: 4, name: 'More' },
        ]}
        values={[{ value: 2 }]}
      />
    );
    const child = await waitFor(() => container.firstChild);
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    expect(child.firstChild.lastChild.firstChild.children).toHaveLength(2);
    expect(child.firstChild.lastChild.firstChild.firstChild).toHaveTextContent(
      'Lights'
    );
  });

  it('loads no values when none provided', async () => {
    const { container } = render(
      <SnnapFormMultiSelect
        name="123"
        options={[
          { id: 1, name: 'Camera' },
          { id: 2, name: 'Lights' },
          { id: 3, name: 'Action' },
          { id: 4, name: 'More' },
        ]}
      />
    );
    const child = await waitFor(() => container.firstChild);
    expect(child.firstChild.lastChild.firstChild.children).toHaveLength(2);
    expect(child.firstChild.lastChild.firstChild.firstChild).toHaveTextContent(
      '123'
    );
  });

  it('loads no values when empty provided', async () => {
    const { container } = render(
      <SnnapFormMultiSelect
        name="123"
        options={[
          { id: 1, name: 'Camera' },
          { id: 2, name: 'Lights' },
          { id: 3, name: 'Action' },
          { id: 4, name: 'More' },
        ]}
        values={[]}
      />
    );
    const child = await waitFor(() => container.firstChild);
    expect(child.firstChild.lastChild.firstChild.children).toHaveLength(2);
    expect(child.firstChild.lastChild.firstChild.firstChild).toHaveTextContent(
      '123'
    );
  });
});
