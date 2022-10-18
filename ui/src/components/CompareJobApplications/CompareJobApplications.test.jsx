import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompareJobApplications from './CompareJobApplications';
import {
  closeAlert,
  closeModal,
  hasAnError,
  hasASuccess,
  hasNoAlert,
  hasSaveInformation,
  hr,
  noModal,
  openModal,
} from '../CommonTestComponents';

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

jest.mock(
  '../JobApplication/JobApplication',
  () =>
    function (props) {
      const { radio } = props;
      return (
        <input
          onClick={() => {
            radio(5);
          }}
        />
      );
    }
);

describe('compare job applications form', () => {
  jest.setTimeout(10000);
  let job;
  let modal;
  const assignMock = jest.fn();

  delete window.location;
  window.location = { reload: assignMock };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    job = hr;
    jobService.jobService.getJob.mockResolvedValue(job);
    jobService.jobService.getJobApplications.mockResolvedValue([{ id: 5 }]);

    const { container } = render(<CompareJobApplications job={job} />);
    modal = await openModal(
      container,
      'Select Application',
      'compareJobApplicationsModal-5'
    );
  });

  it('is a button', () => {
    const { container } = render(<CompareJobApplications job={job} />);
    expect(container.children).toHaveLength(1); // button and div to hold modal
    expect(container.firstChild.firstChild).toHaveClass('btn btn-primary');
    expect(container.firstChild.firstChild.getAttribute('type')).toEqual(
      'button'
    );
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Select Application'
    );
  });

  it('has different text depending on selection of job', () => {
    const hr = { ...job };
    hr.application_selected = 5;
    const { container } = render(<CompareJobApplications job={hr} />);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Application Selected'
    );
  });

  it('has different text depending on date of job', () => {
    const hr = { ...job };
    hr.date_time = '2022-10-13T04:00:00.000Z';
    const { container } = render(<CompareJobApplications job={hr} />);
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

  it('one application is shown when one exists', async () => {
    const applications =
      modal.firstChild.lastChild.firstChild.children[5].firstChild;
    expect(applications).toHaveClass('accordion');
    expect(applications.children).toHaveLength(1);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has save information button in the last row', async () => {
    hasSaveInformation(
      modal,
      'selectJobApplicationButton',
      'Select Job Application'
    );
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has no alert or update present in the last row', async () => {
    hasNoAlert(modal);
  });

  it('does not submit if values are not present/valid', async () => {
    const spy = jest.spyOn(jobService.jobService, 'chooseJobApplication');
    await hasAnError(modal, 'Please select an application');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(jobService.jobService, 'chooseJobApplication');
    jobService.jobService.chooseJobApplication.mockRejectedValue('Some Error');
    const applications =
      modal.firstChild.lastChild.firstChild.children[5].firstChild;
    fireEvent.click(applications.firstChild);
    await hasAnError(modal);
    expect(spy).toHaveBeenCalledWith(5, 5);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('is able to close an alert after failure', async () => {
    jobService.jobService.chooseJobApplication.mockRejectedValue('Some Error');
    const applications =
      modal.firstChild.lastChild.firstChild.children[5].firstChild;
    fireEvent.click(applications.firstChild);
    await closeAlert(modal);
  });

  it('has an alert on success of a submission', async () => {
    const spy = jest.spyOn(jobService.jobService, 'chooseJobApplication');
    jobService.jobService.chooseJobApplication.mockResolvedValue(
      'Some Success'
    );
    const applications =
      modal.firstChild.lastChild.firstChild.children[5].firstChild;
    fireEvent.click(applications.firstChild);
    await hasASuccess(modal, 'Job Application Chosen');
    expect(spy).toHaveBeenCalledWith(5, 5);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('is able to close an alert after success', async () => {
    jobService.jobService.chooseJobApplication.mockResolvedValue(
      'Some Success'
    );
    const applications =
      modal.firstChild.lastChild.firstChild.children[5].firstChild;
    fireEvent.click(applications.firstChild);
    await closeAlert(modal);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('removes the success alert after 5 seconds', async () => {
    jobService.jobService.chooseJobApplication.mockResolvedValue(
      'Some Success'
    );
    const applications =
      modal.firstChild.lastChild.firstChild.children[5].firstChild;
    fireEvent.click(applications.firstChild);
    await noModal(modal);
  });
});
