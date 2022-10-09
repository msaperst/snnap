import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompareJobApplications from './CompareJobApplications';
import { hr, openModal } from '../CommonTestComponents';

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

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
      'compareJobApplicationsModal-5'
    );
  });

  it('multiple applications appear when provided', () => {
    const applications =
      modal.firstChild.lastChild.firstChild.children[5].firstChild;
    expect(applications).toHaveClass('accordion');
    expect(applications.children).toHaveLength(2);
  });
});
