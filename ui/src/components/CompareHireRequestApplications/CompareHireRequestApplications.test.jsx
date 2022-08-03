import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import CompareHireRequestApplications from './CompareHireRequestApplications';
import {
  openModal,
  closeModal,
} from '../NewRequestToHire/NewRequestToHire.test';
import { hr } from '../ApplyToRequestToHire/ApplyToRequestToHire.test';

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

describe('compare hire request applications form', () => {
  jest.setTimeout(10000);
  let hireRequest;
  let modal;
  const assignMock = jest.fn();

  delete window.location;
  window.location = { reload: assignMock };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    hireRequest = hr;
    jobService.jobService.getHireRequest.mockResolvedValue(hireRequest);
    jobService.jobService.getHireRequestApplications.mockResolvedValue([]);

    const { container } = render(
      <CompareHireRequestApplications hireRequest={hireRequest} />
    );
    modal = await openModal(
      container,
      'View Applications',
      'compareHireRequestApplicationsModal-5'
    );
  });

  it('is a button', () => {
    const { container } = render(
      <CompareHireRequestApplications hireRequest={hireRequest} />
    );
    expect(container.children).toHaveLength(1); // button and div to hold modal
    expect(container.firstChild.firstChild).toHaveClass('btn btn-primary');
    expect(container.firstChild.firstChild.getAttribute('type')).toEqual(
      'button'
    );
    expect(container.firstChild.firstChild).toHaveTextContent(
      'View Applications'
    );
  });

  it('opens a modal when button is clicked', () => {
    expect(modal).toBeVisible();
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('closes the modal when button is clicked', async () => {
    await closeModal(modal);
  });

  it('has the correct header', () => {
    expect(modal.firstChild.children).toHaveLength(2);
    expect(modal.firstChild.firstChild).toHaveTextContent(
      'Applications for the Event Session'
    );
  });

  it('has the job information outlined', () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    expect(modalForm.children).toHaveLength(7);
    expect(modalForm.getAttribute('noValidate')).toEqual('');
  });

  it('no applications are shown when none exist', async () => {
    const applications =
      modal.firstChild.lastChild.firstChild.children[5].firstChild;
    expect(applications).toHaveClass('accordion');
    expect(applications.children).toHaveLength(0);
  });

  it('has save information button in the last row', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    const saveRow = modalForm.lastChild;
    expect(saveRow).toHaveClass('mb-3 row');
    expect(saveRow.firstChild).toHaveClass('col');
    expect(saveRow.firstChild.firstChild).toHaveClass('btn btn-primary');
    expect(saveRow.firstChild.firstChild.getAttribute('id')).toEqual(
      'selectRequestToHireApplicationButton'
    );
    expect(saveRow.firstChild.firstChild.getAttribute('type')).toEqual(
      'submit'
    );
    expect(saveRow.firstChild.firstChild).toHaveTextContent(
      'Select Request To Hire Application'
    );
  });

  it('has no alert or update present in the last row', async () => {
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(0);
  });

  it('does not submit if values are not present/valid', async () => {
    // TODO - right now no validity check
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(
      jobService.jobService,
      'chooseHireRequestApplication'
    );
    jobService.jobService.chooseHireRequestApplication.mockRejectedValue(
      'Some Error'
    );
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    await act(async () => {
      fireEvent.click(saveRow.firstChild.firstChild);
    });
    expect(spy).toHaveBeenCalledWith(5, null);
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(1);
    expect(saveRow.lastChild.firstChild).toHaveClass(
      'fade alert alert-danger alert-dismissible show'
    );
    expect(saveRow.lastChild.firstChild.getAttribute('role')).toEqual('alert');
    expect(saveRow.lastChild.firstChild).toHaveTextContent('Some Error');
    expect(saveRow.lastChild.firstChild.children).toHaveLength(1);
    expect(
      saveRow.lastChild.firstChild.firstChild.getAttribute('aria-label')
    ).toEqual('Close alert');
    expect(
      saveRow.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('button');
    expect(saveRow.lastChild.firstChild.firstChild).toHaveClass('btn-close');
  });

  it('is able to close an alert after failure', async () => {
    jobService.jobService.chooseHireRequestApplication.mockRejectedValue(
      'Some Error'
    );
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    await act(async () => {
      fireEvent.click(saveRow.firstChild.firstChild);
    });
    expect(saveRow.lastChild.children).toHaveLength(1);
    fireEvent.click(saveRow.lastChild.firstChild.firstChild);
    expect(saveRow.lastChild.children).toHaveLength(0);
  });

  it('has an alert on success of a submission', async () => {
    const spy = jest.spyOn(
      jobService.jobService,
      'chooseHireRequestApplication'
    );
    jobService.jobService.chooseHireRequestApplication.mockResolvedValue(
      'Some Success'
    );
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    await act(async () => {
      fireEvent.click(saveRow.firstChild.firstChild);
    });
    expect(spy).toHaveBeenCalledWith(5, null);
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(1);
    expect(saveRow.lastChild.firstChild).toHaveClass(
      'fade alert alert-success alert-dismissible show'
    );
    expect(saveRow.lastChild.firstChild.getAttribute('role')).toEqual('alert');
    expect(saveRow.lastChild.firstChild).toHaveTextContent(
      'Hire Request Application Chosen'
    );
    expect(saveRow.lastChild.firstChild.children).toHaveLength(1);
    expect(
      saveRow.lastChild.firstChild.firstChild.getAttribute('aria-label')
    ).toEqual('Close alert');
    expect(
      saveRow.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('button');
    expect(saveRow.lastChild.firstChild.firstChild).toHaveClass('btn-close');
  });

  it('is able to close an alert after success', async () => {
    jobService.jobService.chooseHireRequestApplication.mockResolvedValue(
      'Some Success'
    );
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    await act(async () => {
      fireEvent.click(saveRow.firstChild.firstChild);
    });
    expect(saveRow.lastChild.children).toHaveLength(1);
    fireEvent.click(saveRow.lastChild.firstChild.firstChild);
    expect(saveRow.lastChild.children).toHaveLength(0);
  });

  it('removes the success alert after 5 seconds', async () => {
    jobService.jobService.chooseHireRequestApplication.mockResolvedValue(
      'Some Success'
    );
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    await act(async () => {
      fireEvent.click(saveRow.firstChild.firstChild);
    });
    expect(saveRow.lastChild.children).toHaveLength(1);
    expect(modal).toBeVisible();
    await act(async () => {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 7000));
    });
    expect(saveRow.lastChild.children).toHaveLength(0);
    expect(modal).not.toBeVisible();
  });
});
