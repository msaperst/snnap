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
  let application;
  let jobApplication;

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
    });

    await act(async () => {
      jobApplication = render(<JobApplication jobApplication={application} />);
      const { container } = jobApplication;
      await waitFor(() => container.firstChild);
    });
  });

  it('is an accordion', async () => {
    const { container } = jobApplication;
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('accordion-item');
    expect(container.firstChild.children).toHaveLength(2);
  });

  it('has user and company in header', async () => {
    const { container } = jobApplication;
    expect(container.firstChild.firstChild).toHaveClass('accordion-header');
    expect(
      container.firstChild.firstChild.firstChild.firstChild.firstChild.children
    ).toHaveLength(2);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Max SaperstoneSome Company'
    );
  });

  it('has radio in header when provided', async () => {
    await act(async () => {
      jobApplication = render(
        <JobApplication jobApplication={application} radio="true" />
      );
      const { container } = jobApplication;
      await waitFor(() => container.firstChild);
    });
    const { container } = jobApplication;
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
      jobApplication = render(
        <JobApplication jobApplication={application} radio={updateX} />
      );
      const { container } = jobApplication;
      await waitFor(() => container.firstChild);
    });
    const { container } = jobApplication;
    expect(x).toEqual(0);
    fireEvent.click(
      container.firstChild.firstChild.firstChild.firstChild.firstChild
        .firstChild.firstChild.firstChild
    );
    expect(x).toEqual(1);
  });

  it('has correct body content', async () => {
    const { container } = jobApplication;
    expect(container.firstChild.lastChild).toHaveClass(
      'accordion-collapse collapse'
    );
    expect(container.firstChild.lastChild.firstChild).toHaveClass(
      'accordion-body'
    );
    expect(container.firstChild.lastChild.firstChild.firstChild).toHaveClass(
      'container'
    );
    expect(
      container.firstChild.lastChild.firstChild.firstChild.children
    ).toHaveLength(4);
  });

  it('has avatar and links in first row', async () => {
    const { container } = jobApplication;
    const row =
      container.firstChild.lastChild.firstChild.firstChild.children[0];
    expect(row.children).toHaveLength(5);
    expect(row.children[0]).toHaveTextContent('MS');
    expect(row.children[1]).toHaveTextContent('');
    expect(row.children[2].firstChild.getAttribute('href')).toEqual(
      'https://website.com'
    );
    expect(row.children[3].firstChild.getAttribute('href')).toEqual(
      'https://insta.com'
    );
    expect(row.children[4].firstChild.getAttribute('href')).toEqual(
      'http://facebook.com/me'
    );
  });

  it('has experience in the next row', async () => {
    const { container } = jobApplication;
    const row =
      container.firstChild.lastChild.firstChild.firstChild.children[1];
    expect(row.children).toHaveLength(1);
    expect(row).toHaveTextContent('some awesome experience');
  });

  it('has no equipment/skill data when none provided', async () => {
    const { container } = jobApplication;
    const row =
      container.firstChild.lastChild.firstChild.firstChild.children[2];
    expect(row.children).toHaveLength(2);
    expect(row).toHaveTextContent('EquipmentSkills');
  });

  it('has no equipment/skill data when not an array', async () => {
    const app = application;
    app.equipment = {};
    app.skills = {};
    await loadJobApplicationWithMock(app);
    const { container } = jobApplication;
    const row =
      container.firstChild.lastChild.firstChild.firstChild.children[2];
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
    await loadJobApplicationWithMock(app);
    const { container } = jobApplication;
    const row =
      container.firstChild.lastChild.firstChild.firstChild.children[2];
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
    const { container } = jobApplication;
    const row =
      container.firstChild.lastChild.firstChild.firstChild.children[3];
    expect(row.children).toHaveLength(0);
  });

  it('has no portfolio data when not array', async () => {
    const app = application;
    app.portfolio = {};
    await loadJobApplicationWithMock(app);
    const { container } = jobApplication;
    const row =
      container.firstChild.lastChild.firstChild.firstChild.children[3];
    expect(row.children).toHaveLength(0);
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
    await loadJobApplicationWithMock(app);

    const { container } = jobApplication;
    const row =
      container.firstChild.lastChild.firstChild.firstChild.children[3];
    expect(row.children).toHaveLength(2);
    expect(row.firstChild.firstChild).toHaveTextContent('link1');
    expect(row.firstChild.firstChild.getAttribute('href')).toEqual(
      'https://link1.com'
    );
    expect(row.firstChild.firstChild.getAttribute('target')).toEqual('_blank');
    expect(row.firstChild.firstChild.getAttribute('rel')).toEqual('noreferrer');
    expect(row.lastChild.firstChild).toHaveTextContent('link2');
    expect(row.lastChild.firstChild.getAttribute('href')).toEqual(
      'http://link2.com'
    );
    expect(row.lastChild.firstChild.getAttribute('target')).toEqual('_blank');
    expect(row.lastChild.firstChild.getAttribute('rel')).toEqual('noreferrer');
  });

  async function loadJobApplicationWithMock(app) {
    jobService.jobService.getJobApplication.mockResolvedValue(app);

    await act(async () => {
      jobApplication = render(<JobApplication jobApplication={application} />);
      const { container } = jobApplication;
      await waitFor(() => container.firstChild);
    });
  }
});