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

jest.mock('../../services/company.service');
const companyService = require('../../services/company.service');

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
    companyService.companyService.get.mockResolvedValue({
      name: "Max's Company",
    });
    userService.userService.get.mockResolvedValue({
      first_name: 'Max',
      last_name: 'Saperstone',
      username: 'msaperst',
      rating: null,
    });

    job = {
      id: 5,
      type: "B'nai Mitzvah",
      subtype: 'Assistant',
      details: 'Some details',
      pay: 200,
      duration: 2,
      units: 'Hours',
      date_time: '2022-03-04T23:40:00.000Z',
      equipment: '',
      skills: '',
      user: 4,
      typeId: 5,
      subtypeId: 2,
      loc: 'Fairfax, VA, United States of America',
      lat: 5,
      lon: -71.2345,
    };
    jobDuration = {
      id: 5,
      type: "B'nai Mitzvah",
      subtype: 'Assistant',
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
      subtypeId: 2,
      loc: 'Fairfax, VA, United States of America',
      lat: 5,
      lon: -71.2345,
    };
    createUser = { id: 4 };
    otherUser = { id: 5 };
  });

  function checkCard(container, duration, buttonText) {
    const cardContainer = container.firstChild;
    expect(cardContainer.children).toHaveLength(1);
    expect(cardContainer.firstChild).toHaveClass('card-body');
    expect(cardContainer.firstChild.children).toHaveLength(1);

    expect(cardContainer.firstChild.firstChild).toHaveClass('row');
    expect(cardContainer.firstChild.firstChild.children).toHaveLength(3);
    const avatarCell = cardContainer.firstChild.firstChild.firstChild;
    const infoCell = cardContainer.firstChild.firstChild.children[1];
    const buttonCell = cardContainer.firstChild.firstChild.lastChild;

    expect(avatarCell).toHaveClass('col-md-2 col-6 offset-md-0 offset-3');
    expect(avatarCell.children).toHaveLength(2);
    expect(avatarCell.firstChild).toHaveClass('circle');
    expect(avatarCell.firstChild.children).toHaveLength(1);
    expect(avatarCell.firstChild.firstChild).toHaveTextContent('MS');

    expect(avatarCell.lastChild).toHaveClass('rating');
    expect(avatarCell.lastChild.children).toHaveLength(0);

    expect(infoCell).toHaveClass('col-md-7');
    expect(infoCell.children).toHaveLength(2);
    expect(infoCell.firstChild).toHaveClass('row');
    expect(infoCell.firstChild.children).toHaveLength(3);
    expect(infoCell.firstChild.firstChild).toHaveClass('col-md-4 col-6');
    expect(infoCell.firstChild.firstChild.children).toHaveLength(2);
    expect(infoCell.firstChild.firstChild.firstChild).toHaveClass(
      'card-title h5'
    );
    expect(infoCell.firstChild.firstChild.firstChild).toHaveTextContent(
      'Max Saperstone'
    );
    expect(infoCell.firstChild.firstChild.lastChild).toHaveClass(
      'card-subtitle h6'
    );
    expect(infoCell.firstChild.firstChild.lastChild).toHaveTextContent(
      "Max's Company"
    );

    expect(infoCell.firstChild.children[1]).toHaveClass('col-md-4 col-6');
    expect(infoCell.firstChild.children[1].children).toHaveLength(2);
    expect(infoCell.firstChild.children[1].firstChild).toHaveClass(
      'card-title h5'
    );
    expect(infoCell.firstChild.children[1].firstChild).toHaveTextContent(
      "B'nai Mitzvah"
    );
    expect(infoCell.firstChild.children[1].lastChild).toHaveClass(
      'card-subtitle h6'
    );
    expect(infoCell.firstChild.children[1].lastChild).toHaveTextContent(
      'Assistant'
    );

    expect(infoCell.firstChild.lastChild).toHaveClass('col-md-4');
    expect(infoCell.firstChild.lastChild.children).toHaveLength(2);
    expect(infoCell.firstChild.lastChild.firstChild).toHaveClass('card-text');
    expect(infoCell.firstChild.lastChild.firstChild).toHaveTextContent(
      'Fairfax, VA'
    );
    expect(infoCell.firstChild.lastChild.lastChild).toHaveClass(
      'font-italic card-text'
    );
    expect(infoCell.firstChild.lastChild.lastChild).toHaveTextContent(
      `03/04/2022 for ${duration}`
    );

    expect(infoCell.lastChild).toHaveClass('mt-2 row');
    expect(infoCell.lastChild.children).toHaveLength(1);
    expect(infoCell.lastChild.firstChild).toHaveClass('col');
    expect(infoCell.lastChild.firstChild.children).toHaveLength(1);
    expect(infoCell.lastChild.firstChild.firstChild).toHaveClass('card-text');
    expect(infoCell.lastChild.firstChild.firstChild).toHaveTextContent(
      'Some details'
    );

    expect(buttonCell).toHaveClass('col-md-3');
    expect(buttonCell.children).toHaveLength(1);
    expect(buttonCell.firstChild).toHaveTextContent(buttonText);

    return { cardContainer };
  }

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('displays the basic detail', async () => {
    jobService.jobService.getJobApplications.mockResolvedValue([]);
    await loadJob(job, createUser);
    const { container } = requestForHire;
    checkCard(container, '2 hours', 'Select Application');
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
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
    checkCard(container, '2 hours', 'Already Applied');
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
    checkCard(container, '2 to 3 hours', 'Submit For Job');
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
    await act(async () => {
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

  it('navigates us to the user profile when clicked', async () => {
    jobService.jobService.getJobApplications.mockResolvedValue([]);
    await loadJob(job, createUser);
    const { container } = requestForHire;
    const cardContainer = container.firstChild;
    const avatarCell = cardContainer.firstChild.firstChild.firstChild;
    await act(async () => {
      fireEvent.click(avatarCell.firstChild.firstChild);
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/profile/msaperst');
  });

  it('has no rating when none is supplied', async () => {
    await loadJob(job, createUser);
    const { container } = requestForHire;
    const userCol = container.firstChild.firstChild.firstChild;
    expect(userCol.children[0].lastChild.children).toHaveLength(0);
  });

  it('has plus rating when true is supplied', async () => {
    userService.userService.get.mockResolvedValue({
      firstName: 'Max',
      lastName: 'Saperstone',
      username: 'user',
      rating: true,
    });
    await loadJob(job, createUser);
    const { container } = requestForHire;
    const userCol = container.firstChild.firstChild.firstChild;
    expect(userCol.children[0].lastChild.children).toHaveLength(1);
    expect(userCol.children[0].lastChild.firstChild.children).toHaveLength(2);
    expect(
      userCol.children[0].lastChild.firstChild.firstChild
    ).toHaveTextContent('Thumbs Up');
  });

  it('has minus rating when false is supplied', async () => {
    userService.userService.get.mockResolvedValue({
      firstName: 'Max',
      lastName: 'Saperstone',
      username: 'user',
      rating: false,
    });
    await loadJob(job, createUser);
    const { container } = requestForHire;
    const userCol = container.firstChild.firstChild.firstChild;
    expect(userCol.children[0].lastChild.children).toHaveLength(1);
    expect(userCol.children[0].lastChild.firstChild.children).toHaveLength(2);
    expect(
      userCol.children[0].lastChild.firstChild.firstChild
    ).toHaveTextContent('Thumbs Down');
  });
});
