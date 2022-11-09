import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  closeAlert,
  closeModal,
  hasAnError,
  hasASuccess,
  hasNoAlert,
  hasSaveInformation,
  noModal,
  openModal,
} from '../CommonTestComponents';
import ForgotPassword from './ForgotPassword';

jest.mock('../../services/authentication.service');
const authenticationService = require('../../services/authentication.service');

const mockedNavigate = jest.fn();
const mockedLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: () => mockedLocation,
}));

describe('forgot password modal', () => {
  jest.setTimeout(10000);
  let modal;
  let spy;
  const assignMock = jest.fn();

  delete window.location;
  window.location = { reload: assignMock };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    spy = jest.spyOn(authenticationService.authenticationService, 'forgot');
    const { container } = render(<ForgotPassword />);
    modal = await openModal(
      container,
      'Forgot Password',
      'forgotPasswordModal'
    );
  });

  it('has a button link', () => {
    const { container } = render(<ForgotPassword />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.firstChild).toHaveClass('btn btn-link');
    expect(container.firstChild.firstChild.getAttribute('type')).toEqual(
      'button'
    );
    expect(container.firstChild.firstChild.getAttribute('id')).toEqual(
      'forgotPasswordLink'
    );
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Forgot Password'
    );
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
    expect(modalForm.children).toHaveLength(3);
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
    // the rest is verified via SnnapFormInput
  });

  it('has a description', () => {
    const modalForm = modal.firstChild.lastChild.firstChild;

    expect(modalForm.children[1]).toHaveClass('mb-3 row');
    expect(modalForm.children[1].children).toHaveLength(1);
    expect(modalForm.children[1].firstChild).toHaveClass('col');
    expect(modalForm.children[1].firstChild).toHaveTextContent(
      'A reset code will be sent to the above email address if it has an account registered to it'
    );
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has save information button in the last row', async () => {
    hasSaveInformation(
      modal,
      'requestResetPasswordButton',
      'Request Reset Password'
    );
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
    fireEvent.change(modalForm.firstChild.firstChild.firstChild.firstChild, {
      target: { value: 'some email' },
    });
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    fireEvent.click(saveRow.firstChild.firstChild);
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(0);
    expect(spy).toBeCalledTimes(0);
  });

  it('has an alert on failure of a submission', async () => {
    authenticationService.authenticationService.forgot.mockRejectedValue(
      'Some Error'
    );
    const modalForm = modal.firstChild.lastChild.firstChild;
    fireEvent.change(modalForm.firstChild.firstChild.firstChild.firstChild, {
      target: { value: 'email@email.com' },
    });
    await hasAnError(modal);
    expect(spy).toHaveBeenCalledWith('email@email.com');
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('is able to close an alert after failure', async () => {
    authenticationService.authenticationService.forgot.mockRejectedValue(
      'Some Error'
    );
    const modalForm = modal.firstChild.lastChild.firstChild;
    fireEvent.change(modalForm.firstChild.firstChild.firstChild.firstChild, {
      target: { value: 'email@email.com' },
    });
    await closeAlert(modal);
  });

  it('has an alert on success of a submission', async () => {
    authenticationService.authenticationService.forgot.mockResolvedValue(
      'Some Success'
    );
    const modalForm = modal.firstChild.lastChild.firstChild;
    fireEvent.change(modalForm.firstChild.firstChild.firstChild.firstChild, {
      target: { value: 'email@email.com' },
    });
    await hasASuccess(
      modal,
      'A reset code was sent to your email. This code is only valid for 10 minutes.'
    );
    expect(spy).toHaveBeenCalledWith('email@email.com');
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('is able to close an alert after success', async () => {
    authenticationService.authenticationService.forgot.mockResolvedValue(
      'Some Success'
    );
    const modalForm = modal.firstChild.lastChild.firstChild;
    fireEvent.change(modalForm.firstChild.firstChild.firstChild.firstChild, {
      target: { value: 'email@email.com' },
    });
    await closeAlert(modal);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('removes the success alert after 5 seconds and shows the reset password', async () => {
    authenticationService.authenticationService.forgot.mockResolvedValue(
      'Some Success'
    );
    const modalForm = modal.firstChild.lastChild.firstChild;
    fireEvent.change(modalForm.firstChild.firstChild.firstChild.firstChild, {
      target: { value: 'email@email.com' },
    });
    await noModal(modal);
    const resetModal = await waitFor(() =>
      screen.getByTestId('resetPasswordModal')
    );
    expect(resetModal).toBeVisible();
  });
});
