import React from 'react';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Profile from './Profile';

jest.mock('../../services/user.service');
const userService = require('../../services/user.service');

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

jest.mock('../../services/authentication.service');
const authenticationService = require('../../services/authentication.service');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  // eslint-disable-next-line react/destructuring-assignment,jsx-a11y/anchor-has-content
  Link: (props) => <a {...props} href={props.to} />,
}));

describe('profile card', () => {
  let application;
  let profileCard;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

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

    jobService.jobService.getJobApplication.mockResolvedValue(application);
    authenticationService.authenticationService.currentUserValue = {
      username: 'user',
    };
    userService.userService.get.mockResolvedValue({
      firstName: 'Max',
      lastName: 'Saperstone',
    });

    await act(async () => {
      profileCard = render(
        <Profile type="card" user={{}} company={application} />
      );
      const { container } = profileCard;
      await waitFor(() => container.firstChild);
    });
  });

  it('is a card', async () => {
    const { container } = profileCard;
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('card');
    expect(container.firstChild.children).toHaveLength(2);
  });

  it('has correct header for a simple company', async () => {
    const app = application;
    delete app.job_id;
    await act(async () => {
      profileCard = render(<Profile type="card" user={{}} company={app} />);
      const { container } = profileCard;
      await waitFor(() => container.firstChild);
    });
    const { container } = profileCard;
    expect(container.firstChild.firstChild).toHaveClass('card-title h5');
    expect(container.firstChild.firstChild.firstChild.children).toHaveLength(2);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Max SaperstoneSome Company'
    );
  });

  it('has correct header', async () => {
    const { container } = profileCard;
    expect(container.firstChild.firstChild).toHaveClass('card-title h5');
    expect(container.firstChild.firstChild.firstChild.children).toHaveLength(2);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Max SaperstoneSome Company'
    );
  });

  it('has correct body content', async () => {
    const { container } = profileCard;
    await act(async () => {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 100));
    });
    expect(container.firstChild.lastChild).toHaveClass('card-body');
    expect(container.firstChild.lastChild.children).toHaveLength(5);
  });

  it('has links in first row', async () => {
    const { container } = profileCard;
    const row = container.firstChild.lastChild.children[0];
    expect(row.children).toHaveLength(3);
    expect(row.children[0].firstChild.getAttribute('href')).toEqual(
      'https://website.com'
    );
    expect(row.children[1].firstChild.getAttribute('href')).toEqual(
      'https://insta.com'
    );
    expect(row.children[2].firstChild.getAttribute('href')).toEqual(
      'http://facebook.com/me'
    );
  });

  it('has experience in the next row', async () => {
    const { container } = profileCard;
    const row = container.firstChild.lastChild.children[1];
    expect(row.children).toHaveLength(1);
    expect(row).toHaveTextContent('some awesome experience');
  });

  it('has comments in the next row', async () => {
    const { container } = profileCard;
    const row = container.firstChild.lastChild.children[2];
    expect(row.children).toHaveLength(1);
    expect(row).toHaveTextContent('');
  });

  it('has no equipment/skill data when none provided', async () => {
    const { container } = profileCard;
    const row = container.firstChild.lastChild.children[3];
    expect(row.children).toHaveLength(2);
    expect(row).toHaveTextContent('EquipmentSkills');
  });

  it('has no equipment/skill data when not an array', async () => {
    const app = application;
    app.equipment = [];
    app.skills = [];
    await loadProfileCardWithMock(app);
    const { container } = profileCard;
    const row = container.firstChild.lastChild.children[3];
    expect(row.children).toHaveLength(2);
    expect(row).toHaveTextContent('EquipmentSkills');
  });

  it('displays equipment/skill data in third row', async () => {
    const app = application;
    app.equipment = [
      { value: 1, name: 'Camera', what: 'Some Camera' },
      { value: 2, name: 'Flash', what: 'flashes!!!' },
    ];
    app.skills = [{ value: 3, name: 'Lighting' }];
    await loadProfileCardWithMock(app);
    const { container } = profileCard;
    const row = container.firstChild.lastChild.children[3];
    expect(row.children).toHaveLength(2);

    expect(row.firstChild.children).toHaveLength(3);
    expect(row.firstChild.children[0]).toHaveTextContent('Equipment');
    expect(row.firstChild.children[1]).toHaveTextContent('Camera: Some Camera');
    expect(row.firstChild.children[2]).toHaveTextContent('Flash: flashes!!!');

    expect(row.lastChild.children).toHaveLength(2);
    expect(row.lastChild.children[0]).toHaveTextContent('Skills');
    expect(row.lastChild.children[1]).toHaveTextContent('Lighting');
  });

  it('has no portfolio data when not provided', async () => {
    const { container } = profileCard;
    const row = container.firstChild.lastChild.children[4];
    expect(row.children).toHaveLength(2);
    expect(row.firstChild).toHaveTextContent('Portfolio');
    expect(row.lastChild.children).toHaveLength(0);
  });

  it('displays portfolio data in last row', async () => {
    const app = application;
    app.portfolio = [
      {
        id: 1,
        job_application: 2,
        link: 'https://link1.com',
        description: 'link1',
      },
      {
        id: 2,
        job_application: 2,
        link: 'link2.com',
        description: 'link2',
      },
    ];
    await loadProfileCardWithMock(app);

    const { container } = profileCard;
    const row = container.firstChild.lastChild.children[4];
    expect(row.lastChild.children).toHaveLength(2);
    expect(row.lastChild.firstChild.firstChild).toHaveTextContent('link1');
    // the rest is verified via PortfolioLink
    expect(row.lastChild.lastChild.firstChild).toHaveTextContent('link2');
    // the rest is verified via PortfolioLink
  });

  async function loadProfileCardWithMock(app) {
    jobService.jobService.getJobApplication.mockResolvedValue(app);

    await act(async () => {
      profileCard = render(<Profile company={application} />);
      const { container } = profileCard;
      await waitFor(() => container.firstChild);
    });
  }
});
