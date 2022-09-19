import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import RequestToHire from './RequestToHire';

jest.mock('../../services/user.service');
const userService = require('../../services/user.service');

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('request to hire', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jobService.jobService.getHireRequestApplications.mockResolvedValue([]);
    jobService.jobService.getHireRequest.mockResolvedValue([]);
    userService.userService.get.mockResolvedValue({
      username: 'msaperst',
    });
  });

  it('navigates us to the user profile when clicked', async () => {
    let requestForHire;
    await act(async () => {
      requestForHire = render(
        <RequestToHire
          hireRequest={{
            loc: 'Fairfax, VA, United States of America',
            lat: 5,
            lon: -71.2345,
            date_time: '2022-03-04T23:40:00.000Z',
          }}
          currentUser={{}}
        />
      );
      const { container } = requestForHire;
      await waitFor(() => container.firstChild);
    });
    const { container } = requestForHire;
    const cardContainer = container.firstChild.firstChild.firstChild.firstChild;
    await act(async () => {
      fireEvent.click(
        cardContainer.firstChild.firstChild.firstChild.firstChild
      );
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/profile/msaperst');
  });
});
