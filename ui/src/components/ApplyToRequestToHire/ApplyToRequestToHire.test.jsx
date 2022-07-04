import React from 'react';
import {
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Modal } from 'react-bootstrap';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import ApplyToRequestToHire from './ApplyToRequestToHire';

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

jest.mock('../../services/company.service');
const companyService = require('../../services/company.service');

Enzyme.configure({ adapter: new Adapter() });

describe('apply to request to hire form', () => {
  let wrapper;
  const hireRequest = {
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
  };
  const user = {
    id: 3,
    username: 'msaperst',
    first_name: 'Max',
    last_name: 'Saperstone',
    avatar: null,
  };
  const company = {
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
      },
    ],
    skills: [
      {
        value: 1,
        name: 'Photography',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    companyService.companyService.get.mockResolvedValue(company);
    jobService.jobService.getHireRequest.mockResolvedValue(hireRequest);
    wrapper = Enzyme.mount(
      <ApplyToRequestToHire
        hireRequest={hireRequest}
        user={user}
        company={company}
      />
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
    expect(container.children).toHaveLength(2); // button and div to hold modal
    expect(container.firstChild).toHaveClass('btn btn-primary');
    expect(container.firstChild.getAttribute('type')).toEqual('button');
    expect(container.firstChild).toHaveTextContent('Submit For Job');
  });

  it('opens a modal when button is clicked', async () => {
    const { container } = render(
      <ApplyToRequestToHire
        hireRequest={hireRequest}
        user={user}
        company={company}
      />
    );
    await waitFor(() => container.firstChild);
    const button = getByText(container, 'Submit For Job');
    fireEvent.click(button);

    const modal = await waitFor(() =>
      screen.getByTestId('applyToRequestToHireModal-5')
    );
    expect(modal).toBeVisible();
  });

  it('has the correct state information', () => {
    expect(wrapper.state()).toEqual({
      company,
      formData: company,
      hireRequest,
      isSubmitting: false,
      show: false,
      status: null,
      update: null,
      validated: false,
    });
  });

  it('opens the modal when button is clicked', () => {
    expect(wrapper.state().show).toBeFalsy();
    const button = wrapper.find('#openApplyToRequestToHireButton-5').at(0);
    expect(button.text()).toEqual('Submit For Job');
    button.simulate('click');
    expect(wrapper.state().show).toBeTruthy();
  });

  it('has the correct modal header', () => {
    const button = wrapper.find('#openApplyToRequestToHireButton-5').at(0);
    button.simulate('click');
    const modal = wrapper.find(Modal);
    expect(modal.find('.modal-header').at(0).text()).toEqual(
      'Submit to work the Event Session'
    );
  });

  it('updates inputs when data is entered', () => {
    expect(wrapper.state().formData).toEqual(company);
    wrapper.find('#openApplyToRequestToHireButton-5').at(0).simulate('click');
    const modal = wrapper.find(Modal);
    const event = {
      preventDefault() {},
      target: { value: '100' },
    };
    modal.find('#formName').simulate('change', event);
    modal.find('#formCompany').simulate('change', event);
    modal.find('#formWebsite').simulate('change', event);
    modal.find('#formInstagramLink').simulate('change', event);
    modal.find('#formFacebookLink').simulate('change', event);
    modal.find('#formExperience').simulate('change', event);
    expect(wrapper.state().formData).toEqual({
      experience: "None really, but somebody's gotta work this bitch",
      fb: null,
      id: 1,
      insta: null,
      name: 'Butts R Us',
      user: 1,
      website: 'butts.com',
      equipment: [
        {
          name: 'Flash',
          value: 2,
        },
      ],
      skills: [
        {
          name: 'Photography',
          value: 1,
        },
      ],
      portfolio: [
        {
          company: 1,
          description: 'Gallery 1',
          id: 1,
          link: 'link1.com',
        },
        {},
        {},
        {},
        {},
      ],
      Name: '100',
      Company: '100',
      Website: '100',
      'Instagram Link': '100',
      'Facebook Link': '100',
      Experience: '100',
    });
  });

  it('validates values when submitted', () => {
    jobService.jobService.applyToHireRequest.mockResolvedValue('Some Success');
    expect(wrapper.state().validated).toBeFalsy();
    wrapper.find('#openApplyToRequestToHireButton-5').at(0).simulate('click');
    const button = wrapper.find(Modal).find('Button').at(0);
    expect(button.text()).toEqual('Apply to Request to Hire');
    button.simulate('click');
    expect(wrapper.state().validated).toBeTruthy();
    expect(wrapper.state().show).toBeTruthy();
  });

  it('shows error messages on invalid inputs', async () => {
    jobService.jobService.applyToHireRequest.mockResolvedValue('Some Success');
    wrapper.find('#openApplyToRequestToHireButton-5').at(0).simulate('click');
    await waitFor(() => wrapper.find('.invalid-feedback'));
    expect(wrapper.find('.invalid-feedback')).toHaveLength(28);
    const items = [
      'job type',
      'date',
      'duration',
      'location',
      'pay',
      'job details',
      'equipment',
      'skills',
      'name',
      'company',
      'website',
      'instagram link',
      'facebook link',
      'experience',
      'gallery description',
      'gallery link',
      'gallery description',
      'gallery link',
    ];
    for (let i = 0; i < 18; i++) {
      expect(wrapper.find('.invalid-feedback').at(i).text()).toEqual(
        `Please provide a valid ${items[i]}.`
      );
    }
    wrapper
      .find(Modal)
      .find('#formName')
      .simulate('change', {
        preventDefault() {},
        target: { value: '' },
      });
    wrapper.find(Modal).find('Button').at(0).simulate('click');
    await waitFor(() => wrapper.firstChild);
    for (let i = 0; i < 18; i++) {
      expect(
        wrapper.find('.invalid-feedback').at(i).getDOMNode()
      ).toBeVisible();
    }
  });

  // it('displays an error message on failure', () => {
  //   jobService.jobService.applyToHireRequest.mockRejectedValue('Some Error');
  //   wrapper.find('#openApplyToRequestToHireButton-5').at(0).simulate('click');
  //   expect(wrapper.state().status).toBeNull();
  //   expect(wrapper.state().update).toBeNull();
  //   wrapper.find(Modal).find('Button').at(0).simulate('click');
  //   expect(wrapper.state().status).toEqual('Some Error');
  //   expect(wrapper.state().update).toBeNull();
  //   const alert = wrapper.find(Modal).find('Alert').at(0);
  //   expect(alert.text()).toEqual('Some Error');
  //   expect(alert.getAttribute('class')).toEqual('danger');
  //   expect(alert).toBeVisible();
  // });
  //
  // it('displays a success message on success', () => {
  //   jobService.jobService.applyToHireRequest.mockResolvedValue('Some Success');
  //   wrapper.find('#openApplyToRequestToHireButton-5').at(0).simulate('click');
  //   expect(wrapper.state().status).toBeNull();
  //   expect(wrapper.state().update).toBeNull();
  //   wrapper.find(Modal).find('Button').at(0).simulate('click');
  //   expect(wrapper.state().status).toBeNull();
  //   expect(wrapper.state().update).toEqual('Some Success');
  //   const alert = wrapper.find(Modal).find('Alert').at(0);
  //   expect(alert.text()).toEqual('Some Error');
  //   expect(alert.getAttribute('class')).toEqual('success');
  //   expect(alert).toBeVisible();
  // });
});
