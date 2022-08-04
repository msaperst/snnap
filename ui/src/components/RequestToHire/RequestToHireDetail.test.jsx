import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequestToHireDetail from './RequestToHireDetail';
import { hr } from "../CommonTestComponents";

describe('request to hire detail info', () => {
  jest.setTimeout(10000);
  let hireRequest;
  let hireRequestAlt;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    hireRequest = hr;
    hireRequestAlt = {
      id: 5,
      type: 'Event',
      location: 'Fairfax, VA, United States of America',
      details: "Max's 40th Birthday, woot!!!",
      pay: 0.5,
      duration: 8,
      date_time: '2023-10-13T04:00:00.000Z',
      user: 1,
      durationMax: 9,
      typeId: 2,
    };
  });

  it('has the correct layout for the form', async () => {
    const { container } = render(
      <RequestToHireDetail hireRequest={hireRequest} />
    );
    expect(container.children).toHaveLength(5);
  });

  function checkInput(inputRow, mdSize, id, placeHolder, value) {
    expect(inputRow).toHaveClass(`col-md-${mdSize}`);
    const input = inputRow.firstChild.firstChild;
    expect(input.getAttribute('id')).toEqual(id);
    expect(input.getAttribute('placeholder')).toEqual(placeHolder);
    expect(input.getAttribute('readonly')).toEqual('');
    expect(input.getAttribute('type')).toEqual('text');
    expect(input.getAttribute('value')).toEqual(value);
  }

  it('has the correct job title', async () => {
    const { container } = render(
      <RequestToHireDetail hireRequest={hireRequest} />
    );
    // job info header
    expect(container.firstChild).toHaveClass('mb-3 row');
    expect(container.firstChild).toHaveTextContent('Job Information');
  });

  it('has the correct basic job information', async () => {
    const { container } = render(
      <RequestToHireDetail hireRequest={hireRequest} />
    );
    // job info first row
    expect(container.children[1].children).toHaveLength(3);
    checkInput(
      container.children[1].children[0],
      4,
      'formJobType',
      'Job Type',
      'Event'
    );
    checkInput(
      container.children[1].children[1],
      4,
      'formDate',
      'Date',
      'Friday, October 13, 2023'
    );
    checkInput(
      container.children[1].children[2],
      4,
      'formDuration',
      'Duration',
      '8 hours'
    );
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has the correct basic job information with time span', async () => {
    const { container } = render(
      <RequestToHireDetail hireRequest={hireRequestAlt} />
    );
    // job info first row
    checkInput(
      container.children[1].children[2],
      4,
      'formDuration',
      'Duration',
      '8 to 9 hours'
    );
  });

  it('has the correct location and pay information', async () => {
    const { container } = render(
      <RequestToHireDetail hireRequest={hireRequest} />
    );
    // job info second row
    expect(container.children[2].children).toHaveLength(2);
    checkInput(
      container.children[2].children[0],
      8,
      'formLocation',
      'Location',
      'Fairfax, VA'
    );
    checkInput(
      container.children[2].children[1],
      4,
      'formPay',
      'Pay',
      '$0.5 per hour'
    );
  });

  it('has the correct job details', async () => {
    const { container } = render(
      <RequestToHireDetail hireRequest={hireRequest} />
    );
    // job info third row
    expect(container.children[3].children[0]).toHaveClass('col-md-12');
    const detailsInput =
      container.children[3].children[0].firstChild.firstChild;
    expect(detailsInput.getAttribute('id')).toEqual('formJobDetails');
    expect(detailsInput.getAttribute('placeholder')).toEqual('Job Details');
    expect(detailsInput.getAttribute('readonly')).toEqual('');
    expect(detailsInput.getAttribute('type')).toEqual('textarea');
    expect(detailsInput).toHaveTextContent("Max's 40th Birthday, woot!!!");
  });

  it('has the correct equipment and skills', async () => {
    const { container } = render(
      <RequestToHireDetail hireRequest={hireRequest} />
    );
    // job info fourth row
    expect(container.children[4].children).toHaveLength(2);
    checkInput(
      container.children[4].children[0],
      6,
      'formEquipment',
      'Equipment',
      'Camera'
    );
    checkInput(
      container.children[4].children[1],
      6,
      'formSkills',
      'Skills',
      'Posing,Something'
    );
  });

  it('has the correct equipment and skills when none are listed', async () => {
    const { container } = render(
      <RequestToHireDetail hireRequest={hireRequestAlt} />
    );
    // job info fourth row
    expect(container.children[4].children).toHaveLength(2);
    checkInput(
      container.children[4].children[0],
      6,
      'formEquipment',
      'Equipment',
      ''
    );
    checkInput(
      container.children[4].children[1],
      6,
      'formSkills',
      'Skills',
      ''
    );
  });
});
