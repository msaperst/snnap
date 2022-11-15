import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import Rate from './Rate';
import { closeModal } from '../CommonTestComponents';

jest.mock('../../services/user.service');
const userService = require('../../services/user.service');

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  // eslint-disable-next-line jsx-a11y/anchor-has-content,react/destructuring-assignment
  Link: (props) => <a {...props} href={props.to} />,
}));

describe('snnap menu', () => {
  let modal;
  let spy;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    userService.userService.get.mockResolvedValue({
      first_name: 'Max',
      last_name: 'Saperstone',
      username: 'msaperst',
    });
    jobService.jobService.getJob.mockResolvedValue({
      id: 5,
      type: 'Commercial',
    });

    spy = jest.spyOn(userService.userService, 'rate');
    render(<Rate id={12} userId={1} jobId={5} />);
    modal = await waitFor(() => screen.getByTestId('rateModal'));
  });

  it('shows the modal', () => {
    expect(modal).toBeVisible();
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('closing the modal hides the modal', async () => {
    await closeModal(modal);
  });

  it('modal has the correct title', () => {
    expect(modal.firstChild.children).toHaveLength(2);
    expect(modal.firstChild.firstChild).toHaveTextContent(
      'Please Rate Your Experience'
    );
  });

  it('has the correct layout for the modal content', async () => {
    const modalForm = modal.firstChild.lastChild;
    expect(modalForm.children).toHaveLength(3);
  });

  it('modal has the correct text', () => {
    const modalText = modal.firstChild.lastChild.firstChild;
    expect(modalText).toHaveTextContent(
      'We hope working with Max Saperstone on the Commercial was a good experience. Please let us know if you would work with them again.'
    );
    expect(modalText.firstChild.children).toHaveLength(2);
    expect(modalText.firstChild.children[0].getAttribute('to')).toEqual(
      '/profile/msaperst'
    );
    expect(modalText.firstChild.children[1].getAttribute('to')).toEqual(
      '/jobs#5'
    );
  });

  it('clicking thumbs up submits a "true"', async () => {
    userService.userService.rate.mockRejectedValue('Some Error');
    await act(async () => {
      await fireEvent.click(screen.getByTestId('rate-job-5-good'));
    });
    expect(spy).toHaveBeenCalledWith(12, true);
  });

  it('clicking thumbs down submits a "false"', async () => {
    userService.userService.rate.mockRejectedValue('Some Error');
    await act(async () => {
      await fireEvent.click(screen.getByTestId('rate-job-5-bad'));
    });
    expect(spy).toHaveBeenCalledWith(12, false);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has no alert or update present in the last row', () => {
    const saveRow = modal.firstChild.lastChild.lastChild;
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(0);
  });

  it('has an alert on failure of a submission', async () => {
    userService.userService.rate.mockRejectedValue('Some Error');
    await act(async () => {
      await fireEvent.click(screen.getByTestId('rate-job-5-bad'));
    });
    const saveRow = modal.firstChild.lastChild.lastChild;
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(1);
    expect(saveRow.lastChild.firstChild).toHaveClass(
      `fade alert alert-danger alert-dismissible show`
    );
    expect(saveRow.lastChild.firstChild.getAttribute('role')).toEqual('alert');
    expect(saveRow.lastChild.firstChild).toHaveTextContent('Some Error');
    expect(saveRow.lastChild.firstChild.children).toHaveLength(1);
    expect(
      saveRow.lastChild.firstChild.firstChild.getAttribute('aria-label')
    ).toEqual('Close alert');
    expect(
      saveRow.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('button');
    expect(saveRow.lastChild.firstChild.firstChild).toHaveClass('btn-close');
  });

  it('is able to close an alert after failure', async () => {
    userService.userService.rate.mockRejectedValue('Some Error');
    await act(async () => {
      await fireEvent.click(screen.getByTestId('rate-job-5-bad'));
    });
    const saveRow = modal.firstChild.lastChild.lastChild;
    expect(saveRow.lastChild.children).toHaveLength(1);
    fireEvent.click(saveRow.lastChild.firstChild.firstChild);
    expect(saveRow.lastChild.children).toHaveLength(0);
  });

  it('is able to close an alert after success', async () => {
    userService.userService.rate.mockResolvedValue('Some Success');
    await act(async () => {
      await fireEvent.click(screen.getByTestId('rate-job-5-bad'));
    });
    const saveRow = modal.firstChild.lastChild.lastChild;
    expect(saveRow.lastChild.children).toHaveLength(1);
    fireEvent.click(saveRow.lastChild.firstChild.firstChild);
    expect(saveRow.lastChild.children).toHaveLength(0);
  });

  it('on success, closes modal', async () => {
    userService.userService.rate.mockResolvedValue('Some Success');
    await act(async () => {
      await fireEvent.click(screen.getByTestId('rate-job-5-bad'));
    });
    const saveRow = modal.firstChild.lastChild.lastChild;
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(1);
    expect(saveRow.lastChild.firstChild).toHaveClass(
      `fade alert alert-success alert-dismissible show`
    );
    expect(saveRow.lastChild.firstChild.getAttribute('role')).toEqual('alert');
    expect(saveRow.lastChild.firstChild).toHaveTextContent(
      'Thank you for submitting your rating.'
    );
    expect(saveRow.lastChild.firstChild.children).toHaveLength(1);
    expect(
      saveRow.lastChild.firstChild.firstChild.getAttribute('aria-label')
    ).toEqual('Close alert');
    expect(
      saveRow.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('button');
    expect(saveRow.lastChild.firstChild.firstChild).toHaveClass('btn-close');
    await act(async () => {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 2500));
    });
    expect(modal).not.toBeVisible();
  });
});
