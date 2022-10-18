import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Job from './Job';

jest.mock(
  '../ApplyToJob/ApplyToJob',
  () =>
    function (props) {
      const { applied } = props;
      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
          onClick={() => {
            applied();
          }}
        >
          Submit For Job
        </div>
      );
    }
);

jest.mock('../../services/user.service');
const userService = require('../../services/user.service');

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('job', () => {
  let job;
  let jobDuration;
  let createUser;
  let otherUser;
  let requestForHire;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jobService.jobService.getJobApplications.mockResolvedValue([]);
    jobService.jobService.getJob.mockResolvedValue([]);
    userService.userService.get.mockResolvedValue({
      first_name: 'Max',
      last_name: 'Saperstone',
    });

    job = {
      id: 5,
      type: "B'nai Mitzvah",
      details: 'Some details',
      pay: 200,
      duration: 2,
      units: 'Hours',
      date_time: '2022-03-04T23:40:00.000Z',
      equipment: '',
      skills: '',
      user: 4,
      typeId: 5,
      loc: 'Fairfax, VA, United States of America',
      lat: 5,
      lon: -71.2345,
    };
    jobDuration = {
      id: 5,
      type: "B'nai Mitzvah",
      details: 'Some details',
      pay: 200,
      duration: 2,
      durationMax: 3,
      units: 'Hours',
      date_time: '2022-03-04T23:40:00.000Z',
      equipment: '',
      skills: '',
      user: 4,
      typeId: 5,
      loc: 'Fairfax, VA, United States of America',
      lat: 5,
      lon: -71.2345,
    };
    createUser = { id: 4 };
    otherUser = { id: 5 };
  });

  function checkTop(container) {
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild.firstChild.children).toHaveLength(1);

    const cardContainer = container.firstChild.firstChild.firstChild.firstChild;
    expect(cardContainer.children).toHaveLength(1);
    expect(cardContainer.firstChild.children).toHaveLength(2);

    expect(cardContainer.firstChild.firstChild.children).toHaveLength(2);
    expect(
      cardContainer.firstChild.firstChild.firstChild.children
    ).toHaveLength(1);
    expect(
      cardContainer.firstChild.firstChild.firstChild.firstChild
    ).toHaveClass('circle');
    expect(cardContainer.firstChild.firstChild.lastChild.children).toHaveLength(
      2
    );

    const data = cardContainer.firstChild.firstChild.lastChild;
    expect(data.firstChild.children).toHaveLength(4);
    expect(data.firstChild.children[0]).toHaveTextContent("B'nai Mitzvah");
    expect(data.firstChild.children[1]).toHaveTextContent(
      'Friday, March 04, 2022'
    );
    return { cardContainer, data };
  }

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('displays the basic detail', async () => {
    jobService.jobService.getJobApplications.mockResolvedValue([]);
    await loadJob(job, createUser);
    const { container } = requestForHire;
    const { cardContainer, data } = checkTop(container);
    checkData(cardContainer, data, '2 hours', 'Select Application');
  });

  it('displays the already applied button', async () => {
    jobService.jobService.getJobApplications.mockResolvedValue([
      { user_id: 5 },
    ]);
    jobService.jobService.getJob.mockResolvedValue({
      date_time: '2023-10-13 00:00:00',
      location: 'paris',
    });
    await loadJob(job, otherUser);
    const { container } = requestForHire;
    const cardContainer = container.firstChild.firstChild.firstChild.firstChild;
    const data = cardContainer.firstChild.firstChild.lastChild;
    expect(data.firstChild.children[3]).toHaveTextContent('Already Applied');
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('displays the range detail', async () => {
    jobService.jobService.getJobApplications.mockResolvedValue([]);
    jobService.jobService.getJob.mockResolvedValue({
      date_time: '2023-10-13 00:00:00',
      location: 'paris',
    });
    await loadJob(jobDuration, otherUser);

    const { container } = requestForHire;
    const { cardContainer, data } = checkTop(container);
    checkData(cardContainer, data, '2 to 3 hours', 'Submit For Job');
  });

  it('reloads the applications when applied to', async () => {
    const spy = jest.spyOn(jobService.jobService, 'getJobApplications');
    jobService.jobService.getJobApplications.mockResolvedValue([]);
    jobService.jobService.getJob.mockResolvedValue({
      date_time: '2023-10-13 00:00:00',
      loc: 'paris',
    });
    await loadJob(jobDuration, otherUser);
    const { getByText } = requestForHire;
    expect(spy).toHaveBeenCalledTimes(1);
    act(() => {
      fireEvent.click(getByText('Submit For Job'));
    });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  async function loadJob(request, user) {
    await act(async () => {
      requestForHire = render(<Job job={request} currentUser={user} />);
      const { container } = requestForHire;
      await waitFor(() => container.firstChild);
    });
  }

  function checkData(cardContainer, data, duration, buttonText) {
    expect(data.firstChild.children[2]).toHaveTextContent(duration);
    expect(data.firstChild.children[3]).toHaveTextContent(buttonText);
    expect(data.lastChild.children).toHaveLength(2);
    expect(data.lastChild.children[0]).toHaveTextContent('Fairfax, VA');
    expect(data.lastChild.children[1]).toHaveTextContent('$200 per hour');
    expect(cardContainer.firstChild.lastChild).toHaveTextContent(
      'Some details'
    );
  }
});
