import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewJob from './NewJob';
import {
  closeAlert,
  closeModal,
  hasAnError,
  hasASuccess,
  hasNoAlert,
  hasSaveInformation,
  noModal,
  openModal,
  selectFairfax,
} from '../CommonTestComponents';

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

describe('new job form', () => {
  jest.setTimeout(10000);
  let modal;
  let getText;
  const assignMock = jest.fn();

  delete window.location;
  window.location = { reload: assignMock };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jobService.jobService.getJobTypes.mockResolvedValue([
      { id: 5, type: "B'nai Mitzvah", plural: "B'nai Mitzvahs" },
      { id: 7, type: 'Misc', plural: 'Misc' },
    ]);
    jobService.jobService.getJobSubtypes.mockResolvedValue([
      { id: 5, type: 'Assistant', plural: 'Assistants' },
      { id: 7, type: 'Other', plural: 'Other' },
    ]);
    jobService.jobService.getEquipment.mockResolvedValue([
      { id: 4, name: 'Camera' },
      { id: 6, name: 'Lights' },
    ]);
    jobService.jobService.getSkills.mockResolvedValue([
      { id: 9, name: 'Children' },
      { id: 5, name: 'Retouch' },
    ]);

    const { container, getByText } = render(<NewJob />);
    getText = getByText;
    modal = await openModal(container, 'Create New Job', 'newJobModal');
  });

  it('is a drop down item', () => {
    const { container } = render(<NewJob />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.firstChild).toHaveClass('dropdown-item');
    expect(container.firstChild.firstChild.getAttribute('role')).toEqual(
      'button'
    );
    expect(container.firstChild.firstChild.getAttribute('tabindex')).toEqual(
      '0'
    );
    expect(container.firstChild.firstChild).toHaveTextContent('New Job');
  });

  it('opens a modal when button is clicked', async () => {
    expect(modal).toBeVisible();
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('closes the modal when button is clicked', async () => {
    await closeModal(modal);
  });

  it('has the correct modal header', async () => {
    expect(modal.firstChild.children).toHaveLength(2);
    expect(modal.firstChild.firstChild).toHaveTextContent('Create a new job');
  });

  it('has the correct layout for the form', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    expect(modalForm.children).toHaveLength(7);
    expect(modalForm.getAttribute('noValidate')).toEqual('');
  });

  it('first row has the job type selection', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;

    expect(modalForm.firstChild).toHaveClass('mb-3 row');
    expect(modalForm.firstChild.children).toHaveLength(1);
    expect(modalForm.firstChild.firstChild).toHaveClass('col-md-12');
    const jobTypeInput = modalForm.firstChild.firstChild.firstChild.firstChild;
    expect(jobTypeInput.getAttribute('id')).toEqual('formJobType');
    expect(jobTypeInput.getAttribute('aria-label')).toEqual('Job Type');
    expect(jobTypeInput.getAttribute('disabled')).toBeNull();
    expect(jobTypeInput.getAttribute('required')).toEqual('');

    expect(jobTypeInput.children).toHaveLength(3);
    expect(jobTypeInput.firstChild).toHaveTextContent('Select an option');
    expect(jobTypeInput.firstChild.getAttribute('value')).toEqual('');
    expect(jobTypeInput.children[1]).toHaveTextContent("B'nai Mitzvah");
    expect(jobTypeInput.children[1].getAttribute('value')).toEqual('5');
    expect(jobTypeInput.lastChild).toHaveTextContent('Misc');
    expect(jobTypeInput.lastChild.getAttribute('value')).toEqual('7');
  });

  it('second row has the job subtype selection', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;

    expect(modalForm.children[1]).toHaveClass('mb-3 row');
    expect(modalForm.children[1].children).toHaveLength(1);
    expect(modalForm.children[1].firstChild).toHaveClass('col-md-12');
    const jobSubtypeInput =
      modalForm.children[1].firstChild.firstChild.firstChild;
    expect(jobSubtypeInput.getAttribute('id')).toEqual('formLookingFor');
    expect(jobSubtypeInput.getAttribute('aria-label')).toEqual('Looking For');
    expect(jobSubtypeInput.getAttribute('disabled')).toBeNull();
    expect(jobSubtypeInput.getAttribute('required')).toEqual('');

    expect(jobSubtypeInput.children).toHaveLength(3);
    expect(jobSubtypeInput.firstChild).toHaveTextContent('Select an option');
    expect(jobSubtypeInput.firstChild.getAttribute('value')).toEqual('');
    expect(jobSubtypeInput.children[1]).toHaveTextContent('Assistant');
    expect(jobSubtypeInput.children[1].getAttribute('value')).toEqual('5');
    expect(jobSubtypeInput.lastChild).toHaveTextContent('Other');
    expect(jobSubtypeInput.lastChild.getAttribute('value')).toEqual('7');
  });

  it('third row has the location and date', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    expect(modalForm.children[2]).toHaveClass('mb-3 row');
    expect(modalForm.children[2].children).toHaveLength(2);

    expect(modalForm.children[2].firstChild).toHaveClass('col-md-8');
    const locationInput =
      modalForm.children[2].firstChild.firstChild.children[1];
    expect(modalForm.children[2].firstChild.firstChild.firstChild).toHaveClass(
      'geoapify-close-button'
    );
    expect(locationInput.getAttribute('id')).toEqual('formCity');
    expect(locationInput.getAttribute('placeholder')).toEqual('City');
    expect(locationInput.getAttribute('disabled')).toBeNull();
    expect(locationInput.getAttribute('required')).toBeTruthy();
    expect(locationInput.getAttribute('type')).toEqual('text');
    expect(locationInput.getAttribute('value')).toBeNull();

    expect(modalForm.children[2].lastChild).toHaveClass('col-md-4');
    const dateInput = modalForm.children[2].lastChild.firstChild.firstChild;
    expect(dateInput.getAttribute('id')).toEqual('formDate');
    expect(dateInput.getAttribute('placeholder')).toEqual('Date');
    expect(dateInput.getAttribute('disabled')).toBeNull();
    expect(dateInput.getAttribute('required')).toEqual('');
    expect(dateInput.getAttribute('type')).toEqual('date');
    expect(dateInput.getAttribute('value')).toEqual('');
  });

  it('fourth row has the details', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    expect(modalForm.children[3]).toHaveClass('mb-3 row');
    expect(modalForm.children[3].children).toHaveLength(1);

    expect(modalForm.children[3].firstChild).toHaveClass('col-md-12');
    const detailsInput = modalForm.children[3].firstChild.firstChild.firstChild;
    expect(detailsInput.getAttribute('id')).toEqual('formJobDetails');
    expect(detailsInput.getAttribute('placeholder')).toEqual('Job Details');
    expect(detailsInput.getAttribute('disabled')).toBeNull();
    expect(detailsInput.getAttribute('required')).toEqual('');
    expect(detailsInput.getAttribute('type')).toEqual('textarea');
    expect(detailsInput.getAttribute('value')).toBeNull();
    expect(detailsInput).toHaveTextContent('');
  });

  it('fifth row has the equipment and skills', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    expect(modalForm.children[4]).toHaveClass('mb-3 row');
    expect(modalForm.children[4].children).toHaveLength(2);

    expect(modalForm.children[4].firstChild).toHaveClass('col-md-6');
    const equipmentInput =
      modalForm.children[4].firstChild.firstChild.firstChild;
    expect(equipmentInput.getAttribute('id')).toEqual('formDesiredEquipment');
    expect(equipmentInput.getAttribute('placeholder')).toEqual(
      'Desired Equipment'
    );
    expect(equipmentInput.getAttribute('disabled')).toBeNull();
    expect(equipmentInput.getAttribute('required')).toBeNull();
    expect(equipmentInput.getAttribute('type')).toEqual('text');
    expect(equipmentInput.getAttribute('value')).toEqual('');
    expect(equipmentInput).toHaveTextContent('');
    // TODO - verify correct options, and that none are selected

    expect(modalForm.children[4].lastChild).toHaveClass('col-md-6');
    expect(
      modalForm.children[4].lastChild.firstChild.children[2].firstChild
        .firstChild
    ).toHaveTextContent('Skills Required');
    // TODO - verify correct options, and that none are selected
  });

  it('sixth row has the duration and pay', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    expect(modalForm.children[5]).toHaveClass('mb-3 row');
    expect(modalForm.children[5].children).toHaveLength(2);

    expect(modalForm.children[5].firstChild).toHaveClass('col-md-6');
    const durationInput =
      modalForm.children[5].firstChild.firstChild.firstChild;
    expect(durationInput.getAttribute('id')).toEqual('formDuration');
    expect(durationInput.getAttribute('placeholder')).toBeNull();
    expect(durationInput.getAttribute('disabled')).toBeNull();
    expect(durationInput.getAttribute('type')).toEqual('number');
    expect(durationInput.getAttribute('value')).toBeNull();

    expect(modalForm.children[5].lastChild).toHaveClass('col-md-6');
    expect(modalForm.children[5].lastChild.firstChild.firstChild).toHaveClass(
      'input-group-text'
    );
    expect(
      modalForm.children[5].lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('inputGroupPrePay');
    const payInput = modalForm.children[5].lastChild.firstChild.children[1];
    expect(payInput.getAttribute('id')).toEqual('formPay');
    expect(payInput.getAttribute('placeholder')).toBeNull();
    expect(payInput.getAttribute('disabled')).toBeNull();
    expect(payInput.getAttribute('type')).toEqual('number');
    expect(payInput.getAttribute('value')).toBeNull();
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has save information button in the last row', async () => {
    hasSaveInformation(modal, 'createNewRequestButton', 'Create New Request');
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('has no alert or update present in the last row', async () => {
    hasNoAlert(modal);
  });

  it('does not submit if values are not present/valid', async () => {
    const spy = jest.spyOn(jobService.jobService, 'newJob');
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    fireEvent.click(saveRow.firstChild.firstChild);
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(0);
    expect(spy).toBeCalledTimes(0);
  });

  async function fillOutForm(modalForm, location = true, date = '2030-10-13') {
    fireEvent.change(modalForm.firstChild.firstChild.firstChild.firstChild, {
      target: { value: '7' },
    });
    fireEvent.change(modalForm.children[1].firstChild.firstChild.firstChild, {
      target: { value: '5' },
    });
    if (location) {
      const selectItem = selectFairfax(getText);
      await selectItem(modalForm.children[2].firstChild.firstChild.children[1]);
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 500));
    } else {
      fireEvent.change(
        modalForm.children[2].firstChild.firstChild.children[1],
        {
          target: { value: 'fairfax' },
        }
      );
    }
    fireEvent.change(modalForm.children[2].lastChild.firstChild.firstChild, {
      target: { value: date },
    });
    fireEvent.change(modalForm.children[3].firstChild.firstChild.firstChild, {
      target: { value: 'Some Deets' },
    });
    fireEvent.change(modalForm.children[5].firstChild.firstChild.firstChild, {
      target: { value: '8' },
    });
    fireEvent.change(modalForm.children[5].lastChild.firstChild.children[1], {
      target: { value: '50' },
    });
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 500));
  }

  it('has an alert when no location is properly selected', async () => {
    const spy = jest.spyOn(jobService.jobService, 'newJob');
    jobService.jobService.newJob.mockRejectedValue('Some Error');
    const modalForm = modal.firstChild.lastChild.firstChild;
    await fillOutForm(modalForm, false);
    await hasAnError(modal, 'Please select a valid city from the drop down.');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('has an alert when an old date is selected', async () => {
    const spy = jest.spyOn(jobService.jobService, 'newJob');
    jobService.jobService.newJob.mockRejectedValue('Some Error');
    const modalForm = modal.firstChild.lastChild.firstChild;
    await fillOutForm(modalForm, false, '2010-10-13');
    await hasAnError(modal, 'Please provide a date today or later.');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(jobService.jobService, 'newJob');
    jobService.jobService.newJob.mockRejectedValue('Some Error');
    const modalForm = modal.firstChild.lastChild.firstChild;
    await fillOutForm(modalForm);
    await hasAnError(modal);
    expect(spy).toHaveBeenCalledWith(
      '7',
      '5',
      {
        lat: 38.8462236,
        loc: 'Fairfax, VA, United States of America',
        lon: -77.3063733,
      },
      'Some Deets',
      '50',
      '8',
      undefined,
      '2030-10-13',
      undefined,
      undefined,
      undefined
    );
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('is able to close an alert after failure', async () => {
    jobService.jobService.newJob.mockRejectedValue('Some Error');
    const modalForm = modal.firstChild.lastChild.firstChild;
    await fillOutForm(modalForm);
    await closeAlert(modal);
  });

  it('has an alert on success of a submission', async () => {
    const spy = jest.spyOn(jobService.jobService, 'newJob');
    jobService.jobService.newJob.mockResolvedValue('Some Success');
    const modalForm = modal.firstChild.lastChild.firstChild;
    await fillOutForm(modalForm);
    await hasASuccess(modal, 'New Job Submitted');
    expect(spy).toHaveBeenCalledWith(
      '7',
      '5',
      {
        loc: 'Fairfax, VA, United States of America',
        lat: 38.8462236,
        lon: -77.3063733,
      },
      'Some Deets',
      '50',
      '8',
      undefined,
      '2030-10-13',
      undefined,
      undefined,
      undefined
    );
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('is able to close an alert after success', async () => {
    jobService.jobService.newJob.mockResolvedValue('Some Success');
    const modalForm = modal.firstChild.lastChild.firstChild;
    await fillOutForm(modalForm);
    await closeAlert(modal);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('removes the success alert after 5 seconds', async () => {
    jobService.jobService.newJob.mockResolvedValue('Some Success');
    const modalForm = modal.firstChild.lastChild.firstChild;
    await fillOutForm(modalForm);
    await noModal(modal);
  });
});
