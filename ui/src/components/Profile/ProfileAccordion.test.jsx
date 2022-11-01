import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Profile from './Profile';

jest.mock('../../services/user.service');
const userService = require('../../services/user.service');

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('profile accordion', () => {
  let application;
  let profileAccordion;

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
    userService.userService.get.mockResolvedValue({
      firstName: 'Max',
      lastName: 'Saperstone',
      username: 'user',
    });

    await act(async () => {
      profileAccordion = render(
        <Profile type="accordion" company={application} />
      );
      const { container } = profileAccordion;
      await waitFor(() => container.firstChild);
    });
  });

  it('is an accordion', async () => {
    const { container } = profileAccordion;
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('accordion-item');
    expect(container.firstChild.children).toHaveLength(2);
  });

  it('has correct header for a simple company', async () => {
    const app = application;
    delete app.job_id;
    await act(async () => {
      profileAccordion = render(
        <Profile type="accordion" user={{}} company={app} />
      );
      const { container } = profileAccordion;
      await waitFor(() => container.firstChild);
    });
    const { container } = profileAccordion;
    expect(container.firstChild.firstChild).toHaveClass('accordion-header');
    expect(
      container.firstChild.firstChild.firstChild.firstChild.firstChild.children
    ).toHaveLength(2);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Max SaperstoneSome Company'
    );
  });

  it('has correct header', async () => {
    const { container } = profileAccordion;
    expect(container.firstChild.firstChild).toHaveClass('accordion-header');
    expect(
      container.firstChild.firstChild.firstChild.firstChild.firstChild.children
    ).toHaveLength(2);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Max SaperstoneSome Company'
    );
  });

  it('navigates us to the user profile when clicked', async () => {
    let jobApplication;
    await act(async () => {
      jobApplication = render(
        <Profile
          type="accordion"
          onClick
          user={{ username: 'user' }}
          company={{ job_id: 1 }}
        />
      );
      const { container } = jobApplication;
      await waitFor(() => container.firstChild);
    });
    const { getAllByRole } = jobApplication;
    const avatar = getAllByRole('button')[4];
    await act(async () => {
      fireEvent.click(avatar);
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/profile/user');
  });

  it('has radio in header', async () => {
    await act(async () => {
      profileAccordion = render(
        <Profile type="accordion" company={application} onClick="true" />
      );
      const { container } = profileAccordion;
      await waitFor(() => container.firstChild);
    });
    const { container } = profileAccordion;
    expect(container.firstChild.firstChild).toHaveClass('accordion-header');
    const headers =
      container.firstChild.firstChild.firstChild.firstChild.firstChild;
    expect(headers.children).toHaveLength(3);
    expect(headers).toHaveTextContent('Max SaperstoneSome Company');
    expect(headers.firstChild).toHaveClass('col-md-1');
    expect(headers.firstChild.firstChild.firstChild).toHaveClass(
      'form-check-input'
    );
    expect(
      headers.firstChild.firstChild.firstChild.getAttribute('aria-label')
    ).toEqual('jobApplication-3');
    expect(
      headers.firstChild.firstChild.firstChild.getAttribute('name')
    ).toEqual('jobApplications-2');
    expect(
      headers.firstChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('radio');
  });

  it('executes the provided function in the radio when clicked', async () => {
    let x = 0;
    const updateX = () => {
      x = 1;
    };
    await act(async () => {
      profileAccordion = render(
        <Profile type="accordion" company={application} onClick={updateX} />
      );
      const { container } = profileAccordion;
      await waitFor(() => container.firstChild);
    });
    const { container } = profileAccordion;
    expect(x).toEqual(0);
    fireEvent.click(
      container.firstChild.firstChild.firstChild.firstChild.firstChild
        .firstChild.firstChild.firstChild
    );
    expect(x).toEqual(1);
  });

  it('has correct body content', async () => {
    const { container } = profileAccordion;
    await act(async () => {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 100));
    });
    expect(container.firstChild.lastChild).toHaveClass(
      'accordion-collapse collapse'
    );
    expect(container.firstChild.lastChild.firstChild).toHaveClass(
      'accordion-body'
    );
    expect(container.firstChild.lastChild.firstChild.children).toHaveLength(4);
  });

  it('has links in first row', async () => {
    const { container } = profileAccordion;
    const row = container.firstChild.lastChild.firstChild.children[0];
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
    const { container } = profileAccordion;
    const row = container.firstChild.lastChild.firstChild.children[1];
    expect(row.children).toHaveLength(1);
    expect(row).toHaveTextContent('some awesome experience');
  });

  it('has no equipment/skill data when none provided', async () => {
    const { container } = profileAccordion;
    const row = container.firstChild.lastChild.firstChild.children[2];
    expect(row.children).toHaveLength(2);
    expect(row).toHaveTextContent('EquipmentSkills');
  });

  it('has no equipment/skill data when not an array', async () => {
    const app = application;
    app.equipment = [];
    app.skills = [];
    await loadProfileAccordionWithMock(app);
    const { container } = profileAccordion;
    const row = container.firstChild.lastChild.firstChild.children[2];
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
    await loadProfileAccordionWithMock(app);
    const { container } = profileAccordion;
    const row = container.firstChild.lastChild.firstChild.children[2];
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
    const { container } = profileAccordion;
    const row = container.firstChild.lastChild.firstChild.children[3];
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
    await loadProfileAccordionWithMock(app);

    const { container } = profileAccordion;
    const row = container.firstChild.lastChild.firstChild.children[3];
    expect(row.lastChild.children).toHaveLength(2);
    expect(row.lastChild.firstChild.firstChild).toHaveTextContent('link1');
    // the rest is verified via PortfolioLink
    expect(row.lastChild.lastChild.firstChild).toHaveTextContent('link2');
    // the rest is verified via PortfolioLink
  });

  async function loadProfileAccordionWithMock(app) {
    jobService.jobService.getJobApplication.mockResolvedValue(app);

    await act(async () => {
      profileAccordion = render(
        <Profile type="accordion" company={application} />
      );
      const { container } = profileAccordion;
      await waitFor(() => container.firstChild);
    });
  }
});
