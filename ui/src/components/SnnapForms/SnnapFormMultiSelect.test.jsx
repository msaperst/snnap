import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import SnnapFormMultiSelect from './SnnapFormMultiSelect';

describe('snnap form multi select create', () => {
  const options = [
    { id: 1, name: 'Camera' },
    { id: 2, name: 'Lights' },
    { id: 3, name: 'Action' },
    { id: 4, name: 'More' },
  ];

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

  it('has all options', async () => {
    const { container, getByText } = render(
      <SnnapFormMultiSelect name="MyForm" options={options} />
    );
    fireEvent.keyDown(getByText('MyForm'), { keyCode: 40 });
    await waitFor(() => getByText('Action'));
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children
    ).toHaveLength(4);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[0]
    ).toHaveTextContent('Camera');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[1]
    ).toHaveTextContent('Lights');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2]
    ).toHaveTextContent('Action');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[3]
    ).toHaveTextContent('More');
  });

  // https://stackoverflow.com/questions/55575843/how-to-test-react-select-with-react-testing-library
  const getSelectItem = (getByText) => async (selectLabel, itemText) => {
    fireEvent.keyDown(getByText(selectLabel), { keyCode: 40 });
    await waitFor(() => getByText(itemText));
    fireEvent.click(getByText(itemText));
  };

  it('adds value when onchange is provided', async () => {
    let x = 0;
    let y = 0;
    const updateX = (name, value) => {
      x = name;
      y = value;
    };
    const { container, getByText } = render(
      <SnnapFormMultiSelect
        name="MyForm"
        options={options}
        onChange={updateX}
      />
    );
    const selectItem = getSelectItem(getByText);
    await selectItem('MyForm', 'Lights');
    expect(x).toEqual('MyForm');
    expect(y).toEqual([{ label: 'Lights', value: 2 }]);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.children
    ).toHaveLength(1);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.firstChild
    ).toHaveTextContent('Lights');
  });

  it('adds value when onchange is not provided', async () => {
    const { container, getByText } = render(
      <SnnapFormMultiSelect name="MyForm" options={options} />
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
    let y = 0;
    const updateX = (name, value) => {
      x = name;
      y = value;
    };
    const { container, getByLabelText } = render(
      <SnnapFormMultiSelect
        name="MyForm"
        options={options}
        onChange={updateX}
        values={[{ value: 2 }]}
      />
    );
    const input =
      container.firstChild.firstChild.lastChild.firstChild.firstChild;
    expect(input.children).toHaveLength(1);
    expect(input.firstChild).toHaveTextContent('Lights');
    await act(async () => {
      fireEvent.click(getByLabelText('Remove Lights'));
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 500));
    });
    expect(x).toEqual('MyForm');
    expect(y).toEqual([]);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.children
    ).toHaveLength(0);
  });

  it('removes value when onchange is not provided', async () => {
    const { container, getByLabelText } = render(
      <SnnapFormMultiSelect
        name="MyForm"
        options={options}
        values={[{ value: 2 }]}
      />
    );
    const input =
      container.firstChild.firstChild.lastChild.firstChild.firstChild;
    expect(input.children).toHaveLength(1);
    expect(input.firstChild).toHaveTextContent('Lights');
    await act(async () => {
      fireEvent.click(getByLabelText('Remove Lights'));
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 500));
    });
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
        options={options}
        values={[{ value: 2 }]}
      />
    );
    const child = await waitFor(() => container.firstChild);
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    });
    expect(child.firstChild.lastChild.firstChild.children).toHaveLength(2);
    expect(child.firstChild.lastChild.firstChild.firstChild).toHaveTextContent(
      'Lights'
    );
  });

  it('loads no values when none provided', async () => {
    const { container } = render(
      <SnnapFormMultiSelect name="123" options={options} />
    );
    const child = await waitFor(() => container.firstChild);
    expect(child.firstChild.lastChild.firstChild.children).toHaveLength(2);
    expect(child.firstChild.lastChild.firstChild.firstChild).toHaveTextContent(
      '123'
    );
  });

  it('loads no values when empty provided', async () => {
    const { container } = render(
      <SnnapFormMultiSelect name="123" options={options} values={[]} />
    );
    const child = await waitFor(() => container.firstChild);
    expect(child.firstChild.lastChild.firstChild.children).toHaveLength(2);
    expect(child.firstChild.lastChild.firstChild.firstChild).toHaveTextContent(
      '123'
    );
  });

  it('does not allow you to create when not creatable', async () => {
    const { container, queryAllByText, getByLabelText } = render(
      <SnnapFormMultiSelect name="MyForm" options={options} />
    );
    await waitFor(() => container.firstChild);
    await act(async () => {
      fireEvent.change(getByLabelText('MyForm'), {
        target: { value: 'new option' },
      });
    });
    expect(await queryAllByText('Create "new option"')).toHaveLength(0);
  });

  it('selects a new value when added', async () => {
    const { container } = await createNew();
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.children
    ).toHaveLength(1);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.firstChild
    ).toHaveTextContent('new option');
  });

  it('selects the new value and adds the change', async () => {
    let x = 0;
    let y = 0;
    const updateX = (name, value) => {
      x = name;
      y = value;
    };
    const { container } = await createNew(updateX);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.children
    ).toHaveLength(1);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.firstChild
    ).toHaveTextContent('new option');
    expect(x).toEqual('MyForm');
    expect(y).toEqual([{ label: 'new option', value: 'new5' }]);
  });

  it('adds the new value when deselected', async () => {
    const { container, getByText, getByLabelText } = await createNew();
    await act(async () => {
      fireEvent.click(getByLabelText('Remove new option'));
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 500));
    });
    expect(
      container.firstChild.firstChild.lastChild.firstChild.firstChild.children
    ).toHaveLength(0);
    fireEvent.keyDown(getByText('MyForm'), { keyCode: 40 });
    await waitFor(() => getByText('Action'));
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children
    ).toHaveLength(5);
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[0]
    ).toHaveTextContent('Camera');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[1]
    ).toHaveTextContent('Lights');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[2]
    ).toHaveTextContent('Action');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[3]
    ).toHaveTextContent('More');
    expect(
      container.firstChild.firstChild.lastChild.firstChild.children[4]
    ).toHaveTextContent('new option');
  });

  async function createNew(update = null) {
    const { container, getByText, getByLabelText } = render(
      <SnnapFormMultiSelect
        name="MyForm"
        options={options}
        onChange={update}
        creatable
      />
    );
    await waitFor(() => container.firstChild);
    await act(async () => {
      fireEvent.change(getByLabelText('MyForm'), {
        target: { value: 'new option' },
      });
    });
    await waitFor(() => getByText('Create "new option"'));
    fireEvent.click(getByText('Create "new option"'));
    return { container, getByText, getByLabelText };
  }
});
