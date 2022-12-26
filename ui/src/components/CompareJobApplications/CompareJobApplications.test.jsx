import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
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
  '../Profile/ProfileAccordion',
  () =>
    function (props) {
      const { onClick } = props;
      return (
        <input
          onClick={() => {
            onClick(5);
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

    const container = await getCompare(hr);
    modal = await openModal(
      container,
      'Select Application',
      'compareJobApplicationsModal-5'
    );
  });

  async function getCompare(job) {
    let compare;
    await act(async () => {
      compare = render(<CompareJobApplications job={job} />);
      const { container } = compare;
      await waitFor(() => container.firstChild);
    });
    const { container } = compare;
    return container;
  }

  it('is a button', async () => {
    jobService.jobService.getJobApplications.mockResolvedValue([]);
    const container = await getCompare(job);
    expect(container.children).toHaveLength(1); // button and div to hold modal
    expect(container.firstChild.firstChild).toHaveClass('btn btn-primary');
    expect(container.firstChild.firstChild.getAttribute('type')).toEqual(
      'button'
    );
    expect(container.firstChild.firstChild).toHaveTextContent(
      'View Job Details'
    );
  });

  it('has different text depending on selection of job', async () => {
    const hr = { ...job };
    hr.application_selected = 5;
    jobService.jobService.getJob.mockResolvedValue(hr);
    const container = await getCompare(hr);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Application Selected'
    );
  });

  it('has different text depending on date of job', async () => {
    const hr = { ...job };
    hr.date_time = '2022-10-13T04:00:00.000Z';
    jobService.jobService.getJob.mockResolvedValue(hr);
    const container = await getCompare(hr);
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
    expect(modalForm.children).toHaveLength(9);
    expect(modalForm.getAttribute('noValidate')).toEqual('');
  });

  it('has no application information without applications', async () => {
    const hr = { ...job };
    hr.id = 4;
    jobService.jobService.getJob.mockResolvedValue(hr);
    jobService.jobService.getJobApplications.mockResolvedValue([]);
    const container = await getCompare(hr);
    modal = await openModal(
      container,
      'View Job Details',
      'compareJobApplicationsModal-4'
    );
    const modalForm = modal.firstChild.lastChild.firstChild;
    expect(modalForm.children).toHaveLength(7);
    expect(modalForm.getAttribute('noValidate')).toEqual('');
  });

  it('Applications header are shown if applications exist', async () => {
    const applications =
      modal.firstChild.lastChild.firstChild.children[6].firstChild;
    expect(applications).toHaveClass('h3');
    expect(applications).toHaveTextContent('Applications');
  });

  it('one application is shown when one exists', async () => {
    const applications =
      modal.firstChild.lastChild.firstChild.children[7].firstChild;
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
      modal.firstChild.lastChild.firstChild.children[7].firstChild;
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
      modal.firstChild.lastChild.firstChild.children[7].firstChild;
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
      modal.firstChild.lastChild.firstChild.children[7].firstChild;
    fireEvent.click(applications.firstChild);
    await noModal(modal);
  });

  it('multiple applications appear when provided', async () => {
    job = hr;
    job.id = 6;
    jobService.jobService.getJob.mockResolvedValue(job);
    jobService.jobService.getJobApplication.mockResolvedValue([
      { id: 1, user_id: 5 },
      { id: 2, user_id: 6 },
    ]);
    jobService.jobService.getJobApplications.mockResolvedValue([
      { id: 1, user_id: 5 },
      { id: 2, user_id: 6 },
    ]);

    const { container } = render(<CompareJobApplications job={job} />);
    modal = await openModal(
      container,
      'Select Application',
      'compareJobApplicationsModal-6'
    );
    const applications =
      modal.firstChild.lastChild.firstChild.children[7].firstChild;
    expect(applications).toHaveClass('accordion');
    expect(applications.children).toHaveLength(2);
  });
});
