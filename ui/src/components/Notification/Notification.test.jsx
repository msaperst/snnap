import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Notification from './Notification';

jest.mock('../../services/user.service');
const userService = require('../../services/user.service');

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  // eslint-disable-next-line jsx-a11y/anchor-has-content,react/destructuring-assignment
  Link: (props) => <a {...props} href={props.to} />,
}));

describe('notification', () => {
  let job;
  let application;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    job = {
      id: 5,
      type: "B'nai Mitzvah",
      location: 'Fairfax, VA 20030, United States of America',
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

    application = {
      company_id: 1,
      company_name: 'Some Company',
      experience: 'some awesome experience',
      fb: 'facebook.com/me',
      job_id: 2,
      id: 3,
      insta: 'https://insta.com',
      user_id: 1,
      user_name: 'Max Saperstone',
      website: 'https://website.com',
    };

    jobService.jobService.getJob.mockResolvedValue(job);
    jobService.jobService.getJobApplication.mockResolvedValue(application);
    userService.userService.get.mockResolvedValue({
      first_name: 'Max',
      last_name: 'Saperstone',
    });
  });

  it('shows the notification as unread', async () => {
    let notification;
    await act(async () => {
      notification = render(
        <Notification notification={{ id: 1, reviewed: 0 }} />
      );
      const { container } = notification;
      await waitFor(() => container.firstChild);
    });
    const { container } = notification;
    const message =
      container.firstChild.firstChild.firstChild.firstChild.firstChild
        .firstChild;
    expect(message.lastChild.children).toHaveLength(1);
  });

  it('shows the notification as read', async () => {
    let notification;
    await act(async () => {
      notification = render(
        <Notification notification={{ id: 1, reviewed: 1 }} />
      );
      const { container } = notification;
      await waitFor(() => container.firstChild);
    });
    const { container } = notification;
    const message =
      container.firstChild.firstChild.firstChild.firstChild.firstChild
        .firstChild;
    expect(message.lastChild.children).toHaveLength(0);
  });

  it('displays the test id', async () => {
    let notification;
    await act(async () => {
      notification = render(<Notification notification={{ id: 1 }} />);
      const { container } = notification;
      await waitFor(() => container.firstChild);
    });
    const { container } = notification;
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('data-testid')
    ).toEqual('notification-1');
  });

  it('displays an application submitted message by default', async () => {
    let notification;
    await act(async () => {
      notification = render(
        <Notification notification={{ job: 1, job_application: 1 }} />
      );
      const { container } = notification;
      await waitFor(() => container.firstChild);
    });
    const { container } = notification;
    const message =
      container.firstChild.firstChild.firstChild.firstChild.firstChild
        .firstChild;
    expect(message.firstChild.textContent).toEqual(
      'Max Saperstone applied to your job'
    );
  });

  it('displays an application submitted message', async () => {
    let notification;
    await act(async () => {
      notification = render(
        <Notification
          notification={{
            job: 1,
            what: 'applied',
            job_application: 1,
          }}
        />
      );
      const { container } = notification;
      await waitFor(() => container.firstChild);
    });
    const { container } = notification;
    const message =
      container.firstChild.firstChild.firstChild.firstChild.firstChild
        .firstChild;
    expect(message.firstChild.textContent).toEqual(
      'Max Saperstone applied to your job'
    );
  });

  it('displays an application selected message', async () => {
    let notification;
    await act(async () => {
      notification = render(
        <Notification
          notification={{
            job: 1,
            what: 'selected',
            job_application: 1,
          }}
        />
      );
      const { container } = notification;
      await waitFor(() => container.firstChild);
    });
    const { container } = notification;
    const message =
      container.firstChild.firstChild.firstChild.firstChild.firstChild
        .firstChild;
    expect(message.firstChild.textContent).toEqual(
      'Max Saperstone selected your job application'
    );
  });

  it('marks the application as read', async () => {
    const spy = jest.spyOn(userService.userService, 'markNotificationRead');
    userService.userService.markNotificationRead.mockResolvedValue([]);

    let notification;
    await act(async () => {
      notification = render(
        <Notification notification={{ id: 1, reviewed: 0 }} />
      );
      const { container } = notification;
      await waitFor(() => container.firstChild);
    });
    const { container } = notification;
    const message =
      container.firstChild.firstChild.firstChild.firstChild.firstChild
        .firstChild;
    await act(async () => {
      await fireEvent.click(message.lastChild.firstChild);
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);
    expect(message.lastChild.children).toHaveLength(0);
  });
});
