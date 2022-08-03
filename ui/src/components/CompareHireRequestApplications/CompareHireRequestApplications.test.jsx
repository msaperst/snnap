import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompareHireRequestApplications from './CompareHireRequestApplications';
import {
  closeAlert,
  closeModal,
  hasAnError, hasASuccess,
  hasNoAlert,
  hasSaveInformation,
  hr, noModal,
  openModal
} from "../CommonTestComponents";

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

describe('compare hire request applications form', () => {
  jest.setTimeout(10000);
  let hireRequest;
  let modal;
  const assignMock = jest.fn();

  delete window.location;
  window.location = { reload: assignMock };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    hireRequest = hr;
    jobService.jobService.getHireRequest.mockResolvedValue(hireRequest);
    jobService.jobService.getHireRequestApplications.mockResolvedValue([]);

    const { container } = render(
      <CompareHireRequestApplications hireRequest={hireRequest} />
    );
    modal = await openModal(
      container,
      'View Applications',
      'compareHireRequestApplicationsModal-5'
    );
  });

  it('is a button', () => {
    const { container } = render(
      <CompareHireRequestApplications hireRequest={hireRequest} />
    );
    expect(container.children).toHaveLength(1); // button and div to hold modal
    expect(container.firstChild.firstChild).toHaveClass('btn btn-primary');
    expect(container.firstChild.firstChild.getAttribute('type')).toEqual(
      'button'
    );
    expect(container.firstChild.firstChild).toHaveTextContent(
      'View Applications'
    );
  });

  it('opens a modal when button is clicked', () => {
    expect(modal).toBeVisible();
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('closes the modal when button is clicked', async () => {
    await closeModal(modal);
  });

  it('has the correct header', () => {
    expect(modal.firstChild.children).toHaveLength(2);
    expect(modal.firstChild.firstChild).toHaveTextContent(
      'Applications for the Event Session'
    );
  });

  it('has the job information outlined', () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    expect(modalForm.children).toHaveLength(7);
    expect(modalForm.getAttribute('noValidate')).toEqual('');
  });

  it('no applications are shown when none exist', async () => {
    const applications =
      modal.firstChild.lastChild.firstChild.children[5].firstChild;
    expect(applications).toHaveClass('accordion');
    expect(applications.children).toHaveLength(0);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has save information button in the last row', async () => {
    hasSaveInformation(modal, 'selectRequestToHireApplicationButton', 'Select Request To Hire Application');
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has no alert or update present in the last row', async () => {
    hasNoAlert(modal);
  });

  it('does not submit if values are not present/valid', async () => {
    // TODO - right now no validity check
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(
      jobService.jobService,
      'chooseHireRequestApplication'
    );
    jobService.jobService.chooseHireRequestApplication.mockRejectedValue(
      'Some Error'
    );
    await hasAnError(modal);
    expect(spy).toHaveBeenCalledWith(5, null);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('is able to close an alert after failure', async () => {
    jobService.jobService.chooseHireRequestApplication.mockRejectedValue(
      'Some Error'
    );
    await closeAlert(modal);
  });

  it('has an alert on success of a submission', async () => {
    const spy = jest.spyOn(
      jobService.jobService,
      'chooseHireRequestApplication'
    );
    jobService.jobService.chooseHireRequestApplication.mockResolvedValue(
      'Some Success'
    );
    await hasASuccess(modal, 'Hire Request Application Chosen');
    expect(spy).toHaveBeenCalledWith(5, null);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('is able to close an alert after success', async () => {
    jobService.jobService.chooseHireRequestApplication.mockResolvedValue(
      'Some Success'
    );
    await closeAlert(modal);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('removes the success alert after 5 seconds', async () => {
    jobService.jobService.chooseHireRequestApplication.mockResolvedValue(
      'Some Success'
    );
    await noModal(modal);
  });
});
