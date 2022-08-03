import React from 'react';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
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
  let hireRequest;
  let hireRequestDuration;
  let createUser;
  let otherUser;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jobService.jobService.getHireRequestApplications.mockResolvedValue([]);
    jobService.jobService.getHireRequest.mockResolvedValue([]);
    userService.userService.get.mockResolvedValue({
      first_name: 'Max',
      last_name: 'Saperstone',
    });

    hireRequest = {
      id: 5,
      type: "B'nai Mitzvah",
      location: 'Fairfax, VA, United States of America',
      details: 'Some details',
      pay: 200,
      duration: 2,
      units: 'Hours',
      date_time: '2022-03-04T23:40:00.000Z',
      equipment: '',
      skills: '',
      user: 4,
      typeId: 5,
    };
    hireRequestDuration = {
      id: 5,
      type: "B'nai Mitzvah",
      location: 'Fairfax, VA, United States of America',
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
    ).toHaveLength(2);
    expect(
      cardContainer.firstChild.firstChild.firstChild.firstChild
    ).toHaveClass('rounded-circle');
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

  it('displays the basic detail', async () => {
    jobService.jobService.getHireRequestApplications.mockResolvedValue([]);
    let requestForHire;
    await act(async () => {
      requestForHire = render(
        <RequestToHire hireRequest={hireRequest} currentUser={createUser} />
      );
      const { container } = requestForHire;
      await waitFor(() => container.firstChild);
    });
    const { container } = requestForHire;
    const { cardContainer, data } = checkTop(container);
    expect(data.firstChild.children[2]).toHaveTextContent('2 hours');
    expect(data.firstChild.children[3]).toHaveTextContent('View Applications');
    expect(data.lastChild.children).toHaveLength(2);
    expect(data.lastChild.children[0]).toHaveTextContent('Fairfax, VA');
    expect(data.lastChild.children[1]).toHaveTextContent('$200 per hour');

    expect(cardContainer.firstChild.lastChild).toHaveTextContent(
      'Some details'
    );
  });

  it('displays the already applied button', async () => {
    jobService.jobService.getHireRequestApplications.mockResolvedValue([
      { user_id: 5 },
    ]);
    jobService.jobService.getHireRequest.mockResolvedValue({
      date_time: '2023-10-13 00:00:00',
      location: 'paris',
    });
    let requestForHire;
    await act(async () => {
      requestForHire = render(
        <RequestToHire hireRequest={hireRequest} currentUser={otherUser} />
      );
      const { container } = requestForHire;
      await waitFor(() => container.firstChild);
    });
    const { container } = requestForHire;
    const cardContainer = container.firstChild.firstChild.firstChild.firstChild;
    const data = cardContainer.firstChild.firstChild.lastChild;
    expect(data.firstChild.children[3]).toHaveTextContent('Already Applied');
  });

  it('displays the range detail', async () => {
    jobService.jobService.getHireRequestApplications.mockResolvedValue([]);
    jobService.jobService.getHireRequest.mockResolvedValue({
      date_time: '2023-10-13 00:00:00',
      location: 'paris',
    });
    let requestForHire;
    await act(async () => {
      requestForHire = render(
        <RequestToHire
          hireRequest={hireRequestDuration}
          currentUser={otherUser}
        />
      );
      const { container } = requestForHire;
      await waitFor(() => container.firstChild);
    });
    const { container } = requestForHire;
    const { cardContainer, data } = checkTop(container);
    expect(data.firstChild.children[2]).toHaveTextContent('2 to 3 hours');
    expect(data.firstChild.children[3]).toHaveTextContent('Submit For Job');
    expect(data.lastChild.children).toHaveLength(2);
    expect(data.lastChild.children[0]).toHaveTextContent('Fairfax, VA');
    expect(data.lastChild.children[1]).toHaveTextContent('$200 per hour');

    expect(cardContainer.firstChild.lastChild).toHaveTextContent(
      'Some details'
    );
  });
});
