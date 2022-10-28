import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import EquipmentSelect from './EquipmentSelect';

jest.mock('../../../../services/job.service');
const jobService = require('../../../../services/job.service');

describe('Company information', () => {
  jest.setTimeout(10000);
  const DOWN_ARROW = { keyCode: 40 };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jobService.jobService.getEquipment.mockResolvedValue([
      { id: 1, name: 'Camera' },
      { id: 2, name: 'Lights' },
      { id: 3, name: 'Action' },
      { id: 4, name: 'More' },
    ]);
  });

  it('renders nothing when no values are passed', async () => {
    let equipmentSelect;
    await act(async () => {
      equipmentSelect = render(<EquipmentSelect />);
      const { container } = equipmentSelect;
      await waitFor(() => container.firstChild);
    });
    const { container } = equipmentSelect;
    expect(container.children).toHaveLength(0);
  });

  it('renders a multiselect when equipment is passed', async () => {
    let equipmentSelect;
    await act(async () => {
      equipmentSelect = render(<EquipmentSelect company={{}} />);
      const { container } = equipmentSelect;
      await waitFor(() => container.firstChild);
    });
    const { container } = equipmentSelect;
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('col-md-12');
    expect(container.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild).toHaveClass('multi-select-form');
  });

  it('renders equipment when passed', async () => {
    let equipmentSelect;
    await act(async () => {
      equipmentSelect = render(
        <EquipmentSelect
          company={{ equipment: [{ id: 1, value: 1, name: 'Camera' }] }}
        />
      );
      const { container } = equipmentSelect;
      await waitFor(() => container.firstChild);
    });
    const input = verifyInputField(equipmentSelect);
    expect(input.value).toEqual('');
  });

  it('renders equipment with values when passed', async () => {
    let equipmentSelect;
    await act(async () => {
      equipmentSelect = render(
        <EquipmentSelect
          company={{
            equipment: [
              { id: 1, value: 1, name: 'Camera', what: 'some camera' },
            ],
          }}
        />
      );
      const { container } = equipmentSelect;
      await waitFor(() => container.firstChild);
    });
    const input = verifyInputField(equipmentSelect);
    expect(input.value).toEqual('some camera');
  });

  it('sets equipment value when added', async () => {
    let x = 0;
    const updateX = (_key, value) => {
      x = value;
    };
    let equipmentSelect;
    await act(async () => {
      equipmentSelect = render(
        <EquipmentSelect
          company={{ equipment: [{ id: 1, value: 1, name: 'Camera' }] }}
          onChange={updateX}
        />
      );
      const { container } = equipmentSelect;
      await waitFor(() => container.firstChild);
    });
    const { getByLabelText } = equipmentSelect;
    fireEvent.change(getByLabelText('Camera Equipment List'), {
      target: { value: 'some camera' },
    });
    expect(getByLabelText('Camera Equipment List').value).toEqual(
      'some camera'
    );
    expect(x).toEqual([
      { id: 1, name: 'Camera', value: 1, what: 'some camera' },
    ]);
  });

  it('sets equipment value when multiple are added', async () => {
    let x = 0;
    const updateX = (_key, value) => {
      x = value;
    };
    let equipmentSelect;
    await act(async () => {
      equipmentSelect = render(
        <EquipmentSelect
          company={{
            equipment: [
              { id: 1, value: 1, name: 'Camera' },
              { id: 7, value: 2, name: 'Lights', what: 'Some lights' },
            ],
          }}
          onChange={updateX}
        />
      );
      const { container } = equipmentSelect;
      await waitFor(() => container.firstChild);
    });
    const { getByLabelText } = equipmentSelect;
    fireEvent.change(getByLabelText('Camera Equipment List'), {
      target: { value: 'some camera' },
    });
    expect(getByLabelText('Camera Equipment List').value).toEqual(
      'some camera'
    );
    expect(x).toEqual([
      { id: 1, name: 'Camera', value: 1, what: 'some camera' },
      { id: 7, value: 2, name: 'Lights', what: 'Some lights' },
    ]);
  });

  it('adds equipment when added', async () => {
    let x = 0;
    const updateX = (_key, value) => {
      x = value;
    };
    let equipmentSelect;
    await act(async () => {
      equipmentSelect = render(
        <EquipmentSelect company={{}} onChange={updateX} />
      );
      const { container } = equipmentSelect;
      await waitFor(() => container.firstChild);
    });
    const { container, getByText, getByRole } = equipmentSelect;
    const selectItem = getSelectItem(getByText, getByRole);

    expect(container.children).toHaveLength(1);
    await selectItem('Camera');
    expect(x).toEqual([{ name: 'Camera', value: 1, what: '' }]);
    expect(container.children).toHaveLength(2);
    const input = verifyInputField(equipmentSelect);
    expect(input.value).toEqual('');
  });

  it('adds equipment when added, and one already exists', async () => {
    let x = 0;
    const updateX = (_key, value) => {
      x = value;
    };
    let equipmentSelect;
    await act(async () => {
      equipmentSelect = render(
        <EquipmentSelect
          company={{
            equipment: [
              { id: 1, value: 2, name: 'Lights' },
              { id: 2, value: 3, name: 'Action', what: 'some action' },
            ],
          }}
          onChange={updateX}
        />
      );
      const { container } = equipmentSelect;
      await waitFor(() => container.firstChild);
    });
    const { container, getByText, getByRole } = equipmentSelect;
    const selectItem = getSelectItem(getByText, getByRole);
    expect(container.children).toHaveLength(3);
    await selectItem('Camera');
    expect(x).toEqual([
      {
        name: 'Lights',
        value: 2,
        what: undefined,
      },
      {
        name: 'Action',
        value: 3,
        what: 'some action',
      },
      { name: 'Camera', value: 1, what: '' },
    ]);
    expect(container.children).toHaveLength(4);
  });

  it('removes equipment when removed', async () => {
    let x = 0;
    const updateX = (_key, value) => {
      x = value;
    };
    let equipmentSelect;
    await act(async () => {
      equipmentSelect = render(
        <EquipmentSelect
          company={{
            equipment: [{ id: 1, value: 1, name: 'Camera' }],
          }}
          onChange={updateX}
        />
      );
      const { container } = equipmentSelect;
      await waitFor(() => container.firstChild);
    });
    const { container, getByLabelText } = equipmentSelect;
    expect(container.children).toHaveLength(2);
    const input = verifyInputField(equipmentSelect);
    expect(input.value).toEqual('');
    // the removal
    await waitFor(() => getByLabelText('Remove Camera'));
    fireEvent.click(getByLabelText('Remove Camera'));
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 500));
    expect(container.children).toHaveLength(1);
    expect(x).toEqual([]);
  });

  const getSelectItem = (getByText, getByRole) => async (itemText) => {
    fireEvent.keyDown(getByRole('combobox'), DOWN_ARROW);
    await waitFor(() => getByText(itemText));
    fireEvent.click(getByText(itemText));
  };

  function verifyInputField(equipmentSelect) {
    const { container } = equipmentSelect;
    expect(container.children).toHaveLength(2);
    expect(container.lastChild.children).toHaveLength(1);
    const input = container.lastChild.firstChild.firstChild;
    expect(input).toHaveClass('form-control');
    expect(input).toHaveAttribute('required');
    expect(input.getAttribute('placeholder')).toEqual('Camera Equipment List');
    return input;
  }
});
