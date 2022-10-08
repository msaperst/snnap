import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import JobApplication from './JobApplication';

jest.mock('../../services/user.service');
const userService = require('../../services/user.service');

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('job application', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jobService.jobService.getJobApplication.mockResolvedValue([]);
    userService.userService.get.mockResolvedValue({
      username: 'msaperst',
    });
  });

  it('navigates us to the user profile when clicked', async () => {
    let jobApplication;
    await act(async () => {
      jobApplication = render(<JobApplication jobApplication={{}} />);
      const { container } = jobApplication;
      await waitFor(() => container.firstChild);
    });
    const { container } = jobApplication;
    const row =
      container.firstChild.lastChild.firstChild.firstChild.children[0];
    await act(async () => {
      fireEvent.click(row.firstChild.firstChild);
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/profile/msaperst');
  });
});
