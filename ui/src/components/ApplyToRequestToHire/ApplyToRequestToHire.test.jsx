import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import ApplyToRequestToHire from './ApplyToRequestToHire';
import {
  openModal,
  closeModal,
} from '../NewRequestToHire/NewRequestToHire.test';

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

jest.mock('../../services/company.service');
const companyService = require('../../services/company.service');

// eslint-disable-next-line jest/no-export
export const hr = {
  id: 5,
  type: 'Event',
  location: 'Fairfax, VA, United States of America',
  details: "Max's 40th Birthday, woot!!!",
  pay: 0.5,
  duration: 8,
  date_time: '2023-10-13T04:00:00.000Z',
  user: 1,
  durationMax: null,
  typeId: 2,
  equipment: [
    {
      value: 1,
      name: 'Camera',
    },
  ],
  skills: [
    {
      value: 4,
      name: 'Posing',
    },
    {
      value: 3,
      name: 'Something',
    },
  ],
};

describe('apply to request to hire form', () => {
  jest.setTimeout(10000);
  let hireRequest;
  let user;
  let company;
  let modal;
  const assignMock = jest.fn();

  delete window.location;
  window.location = { reload: assignMock };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    hireRequest = hr;
    user = {
      id: 3,
      username: 'msaperst',
      firstName: 'Max',
      lastName: 'Saperstone',
    };
    company = {
      id: 1,
      user: 1,
      name: 'Butts R Us',
      website: 'butts.com',
      insta: null,
      fb: null,
      experience: "None really, but somebody's gotta work this bitch",
      portfolio: [
        {
          id: 1,
          company: 1,
          link: 'link1.com',
          description: 'Gallery 1',
        },
      ],
      equipment: [
        {
          value: 2,
          name: 'Flash',
          what: 'strobe',
        },
      ],
      skills: [
        {
          value: 1,
          name: 'Photography',
        },
        {
          value: 2,
          name: 'Boogers',
        },
      ],
    };
    companyService.companyService.get.mockResolvedValue(company);
    jobService.jobService.getHireRequest.mockResolvedValue(hireRequest);
    jobService.jobService.getEquipment.mockResolvedValue([
      { id: 4, name: 'Camera' },
      { id: 6, name: 'Lights' },
    ]);

    const { container } = render(
      <ApplyToRequestToHire
        hireRequest={hireRequest}
        user={user}
        company={company}
      />
    );
    modal = await openModal(
      container,
      'Submit For Job',
      'applyToRequestToHireModal-5'
    );
  });

  it('is a button', () => {
    const { container } = render(
      <ApplyToRequestToHire
        hireRequest={hireRequest}
        user={user}
        company={company}
      />
    );
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.firstChild).toHaveClass('btn btn-primary');
    expect(container.firstChild.firstChild.getAttribute('type')).toEqual(
      'button'
    );
    expect(container.firstChild).toHaveTextContent('Submit For Job');
  });

  it('opens a modal when button is clicked', async () => {
    expect(modal).toBeVisible();
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('closes the modal when button is clicked', async () => {
    await closeModal(modal);
  });

  it('has the correct header', async () => {
    expect(modal.firstChild.children).toHaveLength(2);
    expect(modal.firstChild.firstChild).toHaveTextContent(
      'Submit to work the Event Session'
    );
  });

  it('has the correct layout for the form', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    expect(modalForm.children).toHaveLength(13);
    expect(modalForm.getAttribute('noValidate')).toEqual('');
  });

  it('has the correct user information header', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    // your info header
    expect(modalForm.children[5]).toHaveClass('mb-3 row');
    expect(modalForm.children[5]).toHaveTextContent('Your Information');
  });

  it('has the correct user information', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    // your info first row
    expect(modalForm.children[6].children).toHaveLength(2);
    expect(modalForm.children[6].children[0]).toHaveClass('col-md-6');
    const nameInput = modalForm.children[6].children[0].firstChild.firstChild;
    expect(nameInput.getAttribute('id')).toEqual('formName');
    expect(nameInput.getAttribute('placeholder')).toEqual('Name');
    expect(nameInput.getAttribute('readonly')).toBeNull();
    expect(nameInput.getAttribute('type')).toEqual('text');
    expect(nameInput.getAttribute('value')).toEqual('Max Saperstone');

    expect(modalForm.children[6].children[1]).toHaveClass('col-md-6');
    const companyInput =
      modalForm.children[6].children[1].firstChild.firstChild;
    expect(companyInput.getAttribute('id')).toEqual('formCompany');
    expect(companyInput.getAttribute('placeholder')).toEqual('Company');
    expect(companyInput.getAttribute('readonly')).toBeNull();
    expect(companyInput.getAttribute('type')).toEqual('text');
    expect(companyInput.getAttribute('value')).toEqual('Butts R Us');
  });

  it('has the correct links', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    // your info second row
    expect(modalForm.children[7].children).toHaveLength(6);
    expect(modalForm.children[7].children[0]).toHaveClass('col-md-1');
    expect(modalForm.children[7].children[0].firstChild).toHaveClass('icon');
    expect(modalForm.children[7].children[1]).toHaveClass('col-md-3');
    const websiteInput =
      modalForm.children[7].children[1].firstChild.firstChild;
    expect(websiteInput.getAttribute('id')).toEqual('formWebsite');
    expect(websiteInput.getAttribute('placeholder')).toEqual('Website');
    expect(websiteInput.getAttribute('readonly')).toBeNull();
    expect(websiteInput.getAttribute('type')).toEqual('text');
    expect(websiteInput.getAttribute('value')).toEqual('butts.com');

    expect(modalForm.children[7].children[2]).toHaveClass('col-md-1');
    expect(modalForm.children[7].children[2].firstChild).toHaveClass('icon');
    expect(modalForm.children[7].children[3]).toHaveClass('col-md-3');
    const instaInput = modalForm.children[7].children[3].firstChild.firstChild;
    expect(instaInput.getAttribute('id')).toEqual('formInstagramLink');
    expect(instaInput.getAttribute('placeholder')).toEqual('Instagram Link');
    expect(instaInput.getAttribute('readonly')).toBeNull();
    expect(instaInput.getAttribute('type')).toEqual('text');
    expect(instaInput.getAttribute('value')).toEqual('');

    expect(modalForm.children[7].children[4]).toHaveClass('col-md-1');
    expect(modalForm.children[7].children[4].firstChild).toHaveClass('icon');
    expect(modalForm.children[7].children[5]).toHaveClass('col-md-3');
    const fbInput = modalForm.children[7].children[5].firstChild.firstChild;
    expect(fbInput.getAttribute('id')).toEqual('formFacebookLink');
    expect(fbInput.getAttribute('placeholder')).toEqual('Facebook Link');
    expect(fbInput.getAttribute('readonly')).toBeNull();
    expect(fbInput.getAttribute('type')).toEqual('text');
    expect(fbInput.getAttribute('value')).toEqual('');
  });

  it('has the correct experience', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    // your info third row
    expect(modalForm.children[8].children).toHaveLength(1);
    expect(modalForm.children[8].children[0]).toHaveClass('col-md-12');
    const detailsInput =
      modalForm.children[8].children[0].firstChild.firstChild;
    expect(detailsInput.getAttribute('id')).toEqual('formExperience');
    expect(detailsInput.getAttribute('placeholder')).toEqual('Experience');
    expect(detailsInput.getAttribute('readonly')).toBeNull();
    expect(detailsInput.getAttribute('type')).toEqual('textarea');
    expect(detailsInput).toHaveTextContent(
      "None really, but somebody's gotta work this bitch"
    );
  });

  // TODO - multi-selects (see company info)

  it('has the correct portfolio information', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    // your info last row(s)
    expect(modalForm.children[10].children).toHaveLength(2);
    expect(modalForm.children[10].children[0]).toHaveClass('col-md-12');
    const galleryDescription0Input =
      modalForm.children[10].children[0].firstChild.firstChild;
    expect(galleryDescription0Input.getAttribute('id')).toEqual(
      'galleryDescription-0'
    );
    expect(galleryDescription0Input.getAttribute('placeholder')).toEqual(
      'Gallery Description'
    );
    expect(galleryDescription0Input.getAttribute('readonly')).toBeNull();
    expect(galleryDescription0Input.getAttribute('type')).toEqual('textarea');
    expect(galleryDescription0Input).toHaveTextContent('Gallery 1');

    expect(modalForm.children[10].children[1]).toHaveClass('col-md-12');
    const galleryLink0Input =
      modalForm.children[10].children[1].firstChild.firstChild;
    expect(galleryLink0Input.getAttribute('id')).toEqual('galleryLink-0');
    expect(galleryLink0Input.getAttribute('placeholder')).toEqual(
      'Gallery Link'
    );
    expect(galleryLink0Input.getAttribute('readonly')).toBeNull();
    expect(galleryLink0Input.getAttribute('type')).toEqual('text');
    expect(galleryLink0Input.getAttribute('value')).toEqual('link1.com');

    expect(modalForm.children[11].children).toHaveLength(2);
    expect(modalForm.children[11].children[0]).toHaveClass('col-md-12');
    const galleryDescription1Input =
      modalForm.children[11].children[0].firstChild.firstChild;
    expect(galleryDescription1Input.getAttribute('id')).toEqual(
      'galleryDescription-1'
    );
    expect(galleryDescription1Input.getAttribute('placeholder')).toEqual(
      'Gallery Description'
    );
    expect(galleryDescription1Input.getAttribute('readonly')).toBeNull();
    expect(galleryDescription1Input.getAttribute('type')).toEqual('textarea');
    expect(galleryDescription1Input).toHaveTextContent('');

    expect(modalForm.children[11].children[1]).toHaveClass('col-md-12');
    const galleryLink1Input =
      modalForm.children[11].children[1].firstChild.firstChild;
    expect(galleryLink1Input.getAttribute('id')).toEqual('galleryLink-1');
    expect(galleryLink1Input.getAttribute('placeholder')).toEqual(
      'Gallery Link'
    );
    expect(galleryLink1Input.getAttribute('readonly')).toBeNull();
    expect(galleryLink1Input.getAttribute('type')).toEqual('text');
    expect(galleryLink1Input.getAttribute('value')).toEqual('');
  });

  it('has save information button in the last row', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    const saveRow = modalForm.lastChild;
    expect(saveRow).toHaveClass('mb-3 row');
    expect(saveRow.firstChild).toHaveClass('col');
    expect(saveRow.firstChild.firstChild).toHaveClass('btn btn-primary');
    expect(saveRow.firstChild.firstChild.getAttribute('id')).toEqual(
      'applyToRequestToHireButton'
    );
    expect(saveRow.firstChild.firstChild.getAttribute('type')).toEqual(
      'submit'
    );
    expect(saveRow.firstChild.firstChild).toHaveTextContent(
      'Apply to Request to Hire'
    );
  });

  it('has no alert or update present in the last row', async () => {
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(0);
  });

  it('does not submit if values are not present/valid', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    fireEvent.change(modalForm.children[6].firstChild.firstChild.firstChild, {
      target: { value: '' },
    });
    const saveRow = modalForm.lastChild;
    fireEvent.click(saveRow.firstChild.firstChild);
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(0);
  });

  it('does not submit if camera value is not present/valid', async () => {
    const modalForm = modal.firstChild.lastChild.firstChild;
    fireEvent.change(modalForm.children[9].children[1].firstChild.firstChild, {
      target: { value: '' },
    });
    const saveRow = modalForm.lastChild;
    fireEvent.click(saveRow.firstChild.firstChild);
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(0);
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(jobService.jobService, 'applyToHireRequest');
    jobService.jobService.applyToHireRequest.mockRejectedValue('Some Error');
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    await act(async () => {
      fireEvent.click(saveRow.firstChild.firstChild);
    });
    expect(spy).toHaveBeenCalledWith(
      5,
      1,
      1,
      'Max Saperstone',
      'Butts R Us',
      'butts.com',
      undefined,
      undefined,
      "None really, but somebody's gotta work this bitch",
      [
        {
          name: 'Flash',
          value: 2,
          what: 'strobe',
        },
      ],
      [
        { name: 'Photography', value: 1 },
        { name: 'Boogers', value: 2 },
      ],
      [
        {
          company: 1,
          description: 'Gallery 1',
          id: 1,
          link: 'link1.com',
        },
        {},
      ]
    );
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
    jobService.jobService.applyToHireRequest.mockRejectedValue('Some Error');
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    await act(async () => {
      fireEvent.click(saveRow.firstChild.firstChild);
    });
    expect(saveRow.lastChild.children).toHaveLength(1);
    fireEvent.click(saveRow.lastChild.firstChild.firstChild);
    expect(saveRow.lastChild.children).toHaveLength(0);
  });

  it('has an alert on success of a submission', async () => {
    const spy = jest.spyOn(jobService.jobService, 'applyToHireRequest');
    jobService.jobService.applyToHireRequest.mockResolvedValue('Some Success');
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    await act(async () => {
      fireEvent.click(saveRow.firstChild.firstChild);
    });
    expect(spy).toHaveBeenCalledWith(
      5,
      1,
      1,
      'Max Saperstone',
      'Butts R Us',
      'butts.com',
      undefined,
      undefined,
      "None really, but somebody's gotta work this bitch",
      [
        {
          name: 'Flash',
          value: 2,
          what: 'strobe',
        },
      ],
      [
        { name: 'Photography', value: 1 },
        { name: 'Boogers', value: 2 },
      ],
      [
        {
          company: 1,
          description: 'Gallery 1',
          id: 1,
          link: 'link1.com',
        },
        {},
      ]
    );
    expect(saveRow.lastChild).toHaveClass('col');
    expect(saveRow.lastChild.children).toHaveLength(1);
    expect(saveRow.lastChild.firstChild).toHaveClass(
      'fade alert alert-success alert-dismissible show'
    );
    expect(saveRow.lastChild.firstChild.getAttribute('role')).toEqual('alert');
    expect(saveRow.lastChild.firstChild).toHaveTextContent(
      'Job Filing Submitted'
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
    jobService.jobService.applyToHireRequest.mockResolvedValue('Some Success');
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    await act(async () => {
      fireEvent.click(saveRow.firstChild.firstChild);
    });
    expect(saveRow.lastChild.children).toHaveLength(1);
    fireEvent.click(saveRow.lastChild.firstChild.firstChild);
    expect(saveRow.lastChild.children).toHaveLength(0);
  });

  it('removes the success alert after 5 seconds', async () => {
    jobService.jobService.applyToHireRequest.mockResolvedValue('Some Success');
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

  it('can handle changing of values', async () => {
    const spy = jest.spyOn(jobService.jobService, 'applyToHireRequest');
    jobService.jobService.applyToHireRequest.mockResolvedValue('Some Success');
    const modalForm = modal.firstChild.lastChild.firstChild;
    fireEvent.change(modalForm.children[6].firstChild.firstChild.firstChild, {
      target: { value: 'New Person' },
    });
    fireEvent.change(modalForm.children[6].children[1].firstChild.firstChild, {
      target: { value: 'Company 1' },
    });
    fireEvent.change(modalForm.children[7].children[1].firstChild.firstChild, {
      target: { value: 'https://butts.com' },
    });
    fireEvent.change(modalForm.children[7].children[3].firstChild.firstChild, {
      target: { value: 'https://insta.com' },
    });
    fireEvent.change(modalForm.children[7].children[5].firstChild.firstChild, {
      target: { value: 'https://fb.com' },
    });
    fireEvent.change(modalForm.children[8].firstChild.firstChild.firstChild, {
      target: { value: 'new experience' },
    });
    // TODO - verify we can change multi-select options (line 9)
    fireEvent.change(modalForm.children[10].firstChild.firstChild.firstChild, {
      target: { value: '' },
    });
    fireEvent.change(modalForm.children[10].lastChild.firstChild.firstChild, {
      target: { value: '' },
    });
    const saveRow = modal.firstChild.lastChild.firstChild.lastChild;
    await act(async () => {
      fireEvent.click(saveRow.firstChild.firstChild);
    });
    expect(spy).toHaveBeenCalledWith(
      5,
      1,
      1,
      'New Person',
      'Company 1',
      'https://butts.com',
      'https://insta.com',
      'https://fb.com',
      'new experience',
      [
        {
          name: 'Flash',
          value: 2,
          what: 'strobe',
        },
      ],
      [
        { name: 'Photography', value: 1 },
        { name: 'Boogers', value: 2 },
      ],
      [{}]
    );
  });
});
