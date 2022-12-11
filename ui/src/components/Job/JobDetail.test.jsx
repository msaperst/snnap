import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobDetail from './JobDetail';
import { hr } from '../CommonTestComponents';

describe('job detail info', () => {
  jest.setTimeout(10000);
  let job;
  let jobAlt;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    job = hr;
    jobAlt = {
      id: 5,
      type: 'Event',
      subtype: 'Assistant',
      details: "Max's 40th Birthday, woot!!!",
      pay: 0.5,
      duration: 8,
      date_time: '2023-10-13T04:00:00.000Z',
      user: 1,
      durationMax: 9,
      typeId: 2,
      subtypeId: 2,
      loc: 'Fairfax, VA, United States of America',
      lat: 5,
      lon: -71.2345,
    };
  });

  it('has the correct layout for the form', async () => {
    const { container } = render(<JobDetail job={job} />);
    expect(container.children).toHaveLength(6);
  });

  function checkInput(inputRow, mdSize, id, placeHolder, value) {
    expect(inputRow).toHaveClass(`col-md-${mdSize}`);
    const input = inputRow.firstChild.firstChild;
    expect(input.getAttribute('id')).toEqual(id);
    expect(input.getAttribute('placeholder')).toEqual(placeHolder);
    expect(input.getAttribute('disabled')).toEqual('');
    expect(input.getAttribute('type')).toEqual('text');
    expect(input.getAttribute('value')).toEqual(value);
  }

  it('has the correct job title', async () => {
    const { container } = render(<JobDetail job={job} />);
    // job info header
    expect(container.firstChild).toHaveClass('mb-3 row');
    expect(container.firstChild).toHaveTextContent('Job Information');
  });

  it('has the correct basic job information', async () => {
    const { container } = render(<JobDetail job={job} />);
    // job info first row
    expect(container.children[1].children).toHaveLength(2);
    checkInput(
      container.children[1].children[0],
      6,
      'formJobType',
      'Job Type',
      'Event'
    );
    checkInput(
      container.children[1].children[1],
      6,
      'formLookingFor',
      'Looking For',
      'Assistant'
    );
  });

  it('has the correct location and date', async () => {
    const { container } = render(<JobDetail job={job} />);
    // job info second row
    expect(container.children[2].children).toHaveLength(2);
    checkInput(
      container.children[2].children[0],
      8,
      'formCity',
      'City',
      'Fairfax, VA'
    );
    checkInput(
      container.children[2].children[1],
      4,
      'formDate',
      'Date',
      'Friday, October 13, 2023'
    );
  });

  it('has the correct equipment and skills', async () => {
    const { container } = render(<JobDetail job={job} />);
    // job info fourth row
    expect(container.children[3].children).toHaveLength(2);
    checkInput(
      container.children[3].children[0],
      6,
      'formDesiredEquipment',
      'Desired Equipment',
      'Camera'
    );
    checkInput(
      container.children[3].children[1],
      6,
      'formSkillsRequired',
      'Skills Required',
      'Posing, Something'
    );
  });

  it('has the correct equipment and skills when none are listed', async () => {
    const { container } = render(<JobDetail job={jobAlt} />);
    // job info fourth row
    expect(container.children[3].children).toHaveLength(2);
    checkInput(
      container.children[3].children[0],
      6,
      'formDesiredEquipment',
      'Desired Equipment',
      ' '
    );
    checkInput(
      container.children[3].children[1],
      6,
      'formSkillsRequired',
      'Skills Required',
      ' '
    );
  });

  it('has the correct job details', async () => {
    const { container } = render(<JobDetail job={job} />);
    // job info third row
    expect(container.children[4].children[0]).toHaveClass('col-md-12');
    const detailsInput =
      container.children[4].children[0].firstChild.firstChild;
    expect(detailsInput.getAttribute('id')).toEqual('formJobDetails');
    expect(detailsInput.getAttribute('placeholder')).toEqual('Job Details');
    expect(detailsInput.getAttribute('disabled')).toEqual('');
    expect(detailsInput.getAttribute('type')).toBeNull(); // sign of a textarea
    expect(detailsInput).toHaveTextContent("Max's 40th Birthday, woot!!!");
  });

  it('has the correct time and pay', async () => {
    const { container } = render(<JobDetail job={job} />);
    // job info fourth row
    expect(container.children[5].children).toHaveLength(2);
    checkInput(
      container.children[5].children[0],
      6,
      'formDuration',
      'Duration',
      '8 hours'
    );
    checkInput(
      container.children[5].children[1],
      6,
      'formPay',
      'Pay',
      '$0.5 per hour'
    );
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has the correct basic job information with time span', async () => {
    const { container } = render(<JobDetail job={jobAlt} />);
    // job info first row
    checkInput(
      container.children[5].children[0],
      6,
      'formDuration',
      'Duration',
      '8 to 9 hours'
    );
  });
});
