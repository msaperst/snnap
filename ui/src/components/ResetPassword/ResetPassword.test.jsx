import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import {
  closeAlert,
  closeModal,
  hasAnError,
  hasNoAlert,
  hasSaveInformation,
} from '../CommonTestComponents';
import ResetPassword from './ResetPassword';

jest.mock('../../services/authentication.service');
const authenticationService = require('../../services/authentication.service');

const mockedNavigate = jest.fn();
const mockedLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: () => mockedLocation,
}));

describe('reset password modal', () => {
  jest.setTimeout(10000);
  let modal;
  let spy;
  const assignMock = jest.fn();

  delete window.location;
  window.location = { reload: assignMock };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    spy = jest.spyOn(authenticationService.authenticationService, 'reset');
    render(<ResetPassword display />);
    modal = await waitFor(() => screen.getByTestId('resetPasswordModal'));
  });

  it('clicking the button shows the modal', () => {
    expect(modal).toBeVisible();
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('closing the modal hides the modal', async () => {
    await closeModal(modal);
  });

  it('has the correct modal header', async () => {
    expect(modal.firstChild.children).toHaveLength(2);
    expect(modal.firstChild.firstChild).toHaveTextContent('Password Reset');
  });

  it('has the correct layout for the form', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    expect(modalForm.children).toHaveLength(4);
    expect(modalForm.getAttribute('noValidate')).toEqual('');
  });

  it('has an email input field', () => {
    const modalForm = modal.firstChild.lastChild.firstChild;

    expect(modalForm.firstChild).toHaveClass('mb-3 row');
    expect(modalForm.firstChild.children).toHaveLength(1);
    expect(modalForm.firstChild.firstChild).toHaveClass('col-md-12');
    const jobTypeInput = modalForm.firstChild.firstChild.firstChild.firstChild;
    expect(jobTypeInput.getAttribute('id')).toEqual('formEmail');
    expect(jobTypeInput.getAttribute('placeholder')).toEqual('Email');
    expect(jobTypeInput.getAttribute('required')).toEqual('');
    expect(jobTypeInput.getAttribute('disabled')).toBeNull();
    expect(jobTypeInput.getAttribute('value')).toEqual('');
    // the rest is verified via SnnapFormInput
  });

  it('has provided email in email input field', async () => {
    const { getAllByTestId } = render(
      <ResetPassword display email="email@email.com" />
    );
    modal = await waitFor(() => getAllByTestId('resetPasswordModal'));

    const modalForm = modal[1].firstChild.lastChild.firstChild;
    const jobTypeInput = modalForm.firstChild.firstChild.firstChild.firstChild;
    expect(jobTypeInput.getAttribute('value')).toEqual('email@email.com');
  });

  it('has a code input field', () => {
    const modalForm = modal.firstChild.lastChild.firstChild;

    expect(modalForm.children[1]).toHaveClass('mb-3 row');
    expect(modalForm.children[1].children).toHaveLength(1);
    expect(modalForm.children[1].firstChild).toHaveClass('col-md-12');
    const jobTypeInput = modalForm.children[1].firstChild.firstChild.firstChild;
    expect(jobTypeInput.getAttribute('id')).toEqual('formCode');
    expect(jobTypeInput.getAttribute('placeholder')).toEqual('Code');
    expect(jobTypeInput.getAttribute('required')).toEqual('');
    expect(jobTypeInput.getAttribute('disabled')).toBeNull();
    // the rest is verified via SnnapFormInput
  });

  it('has a new password input field', () => {
    const modalForm = modal.firstChild.lastChild.firstChild;

    expect(modalForm.children[2]).toHaveClass('mb-3 row');
    expect(modalForm.children[2].children).toHaveLength(1);
    expect(modalForm.children[2].firstChild).toHaveClass('col-md-12');
    const jobTypeInput = modalForm.children[2].firstChild.firstChild.firstChild;
    expect(jobTypeInput.getAttribute('id')).toEqual('formNewPassword');
    expect(jobTypeInput.getAttribute('disabled')).toBeNull();
    expect(jobTypeInput.getAttribute('type')).toEqual('password');
    expect(jobTypeInput.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormPassword.test.jsx
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has save information button in the last row', async () => {
    hasSaveInformation(modal, 'resetPasswordButton', 'Reset Password');
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has no alert or update present in the last row', async () => {
    hasNoAlert(modal);
  });

  it('does not submit if values are not present', async () => {
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    fireEvent.click(saveRow.firstChild.firstChild);
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(0);
    expect(spy).toBeCalledTimes(0);
  });

  it('does not submit if values are not valid', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    fillOutForm(modalForm, 'some email');
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    fireEvent.click(saveRow.firstChild.firstChild);
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(0);
    expect(spy).toBeCalledTimes(0);
  });

  it('has an alert on failure of a submission', async () => {
    authenticationService.authenticationService.reset.mockRejectedValue(
      'Some Error'
    );
    const modalForm = modal.firstChild.lastChild.firstChild;
    fillOutForm(modalForm, 'email@email.com');
    await hasAnError(modal);
    expect(spy).toHaveBeenCalledWith(
      'email@email.com',
      '123456',
      'somenewpassword'
    );
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('is able to close an alert after failure', async () => {
    authenticationService.authenticationService.reset.mockRejectedValue(
      'Some Error'
    );
    const modalForm = modal.firstChild.lastChild.firstChild;
    fillOutForm(modalForm, 'email@email.com');
    await closeAlert(modal);
  });

  it('on success, logs you in and closes modal', async () => {
    authenticationService.authenticationService.reset.mockResolvedValue(
      'Some Success'
    );
    const modalForm = modal.firstChild.lastChild.firstChild;
    fillOutForm(modalForm, 'email@email.com');
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    await act(async () => {
      fireEvent.click(saveRow.firstChild.firstChild);
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  function fillOutForm(modalForm, email) {
    fireEvent.change(modalForm.firstChild.firstChild.firstChild.firstChild, {
      target: { value: email },
    });
    fireEvent.change(modalForm.children[1].firstChild.firstChild.firstChild, {
      target: { value: '123456' },
    });
    fireEvent.change(modalForm.children[2].firstChild.firstChild.firstChild, {
      target: { value: 'somenewpassword' },
    });
  }
});
