import { fireEvent, getByText, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

export const hr = {
  id: 5,
  type: 'Event',
  location: 'Fairfax, VA, United States of America',
  details: "Max's 40th Birthday, woot!!!",
  pay: 0.5,
  duration: 8,
  date_time: '2023-10-13T04:00:00.000Z',
  user: 1,
  durationMax: null,
  typeId: 2,
  equipment: [
    {
      value: 1,
      name: 'Camera',
    },
  ],
  skills: [
    {
      value: 4,
      name: 'Posing',
    },
    {
      value: 3,
      name: 'Something',
    },
  ],
};

export async function openModal(container, buttonText, modalId) {
  await waitFor(() => container.firstChild);
  const button = getByText(container, buttonText);
  fireEvent.click(button);

  return waitFor(() => screen.getByTestId(modalId));
}

export async function closeModal(modal) {
  fireEvent.click(modal.firstChild.firstChild.lastChild);
  await act(async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 2000));
  });
  expect(modal).not.toBeVisible();
}

export function hasSaveInformation(modal, id, text) {
  const modalForm = modal.firstChild.lastChild.firstChild;
  const saveRow = modalForm.lastChild;
  expect(saveRow).toHaveClass('mb-3 row');
  expect(saveRow.firstChild).toHaveClass('col');
  expect(saveRow.firstChild.firstChild).toHaveClass('btn btn-primary');
  expect(saveRow.firstChild.firstChild.getAttribute('id')).toEqual(id);
  expect(saveRow.firstChild.firstChild.getAttribute('type')).toEqual('submit');
  expect(saveRow.firstChild.firstChild).toHaveTextContent(text);
}

export function hasNoAlert(modal) {
  const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
  expect(saveRow.lastChild).toHaveClass('col');
  expect(saveRow.lastChild.children).toHaveLength(0);
}

async function hasAnAlert(modal, type, message) {
  const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
  await act(async () => {
    fireEvent.click(saveRow.firstChild.firstChild);
  });
  expect(saveRow.lastChild).toHaveClass('col');
  expect(saveRow.lastChild.children).toHaveLength(1);
  expect(saveRow.lastChild.firstChild).toHaveClass(
    `fade alert alert-${type} alert-dismissible show`
  );
  expect(saveRow.lastChild.firstChild.getAttribute('role')).toEqual('alert');
  expect(saveRow.lastChild.firstChild).toHaveTextContent(message);
  expect(saveRow.lastChild.firstChild.children).toHaveLength(1);
  expect(
    saveRow.lastChild.firstChild.firstChild.getAttribute('aria-label')
  ).toEqual('Close alert');
  expect(saveRow.lastChild.firstChild.firstChild.getAttribute('type')).toEqual(
    'button'
  );
  expect(saveRow.lastChild.firstChild.firstChild).toHaveClass('btn-close');
}

export async function hasAnError(modal, message = 'Some Error') {
  await hasAnAlert(modal, 'danger', message);
}

export async function hasASuccess(modal, message) {
  await hasAnAlert(modal, 'success', message);
}

export async function closeAlert(modal) {
  const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
  await act(async () => {
    fireEvent.click(saveRow.firstChild.firstChild);
  });
  expect(saveRow.lastChild.children).toHaveLength(1);
  fireEvent.click(saveRow.lastChild.firstChild.firstChild);
  expect(saveRow.lastChild.children).toHaveLength(0);
}

export async function noModal(modal) {
  const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
  await act(async () => {
    fireEvent.click(saveRow.firstChild.firstChild);
  });
  expect(saveRow.lastChild.children).toHaveLength(1);
  expect(modal).toBeVisible();
  await act(async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 7000));
  });
  expect(saveRow.lastChild.children).toHaveLength(0);
  expect(modal).not.toBeVisible();
}
