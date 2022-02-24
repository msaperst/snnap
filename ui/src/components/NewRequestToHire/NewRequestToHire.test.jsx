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
import NewRequestToHire from './NewRequestToHire';

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

Enzyme.configure({ adapter: new Adapter() });

describe('snnap form input', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jobService.jobService.getJobTypes.mockResolvedValue([
      { id: 5, type: "B'nai Mitzvah", plural: "B'nai Mitzvahs" },
      { id: 7, type: 'Misc', plural: 'Misc' },
    ]);
    jobService.jobService.getEquipment.mockResolvedValue([
      { id: 4, name: 'Camera' },
      { id: 6, name: 'Lights' },
    ]);
    jobService.jobService.getSkills.mockResolvedValue([
      { id: 9, name: 'Children' },
      { id: 5, name: 'Retouch' },
    ]);
    wrapper = Enzyme.mount(<NewRequestToHire />);
  });

  it('has a button', () => {
    const { container } = render(<NewRequestToHire />);
    expect(container.children).toHaveLength(2); // button and div to hold modal
    expect(container.firstChild).toHaveClass('btn btn-primary nav-link');
    expect(container.firstChild.getAttribute('role')).toEqual('button');
    expect(container.firstChild.getAttribute('tabindex')).toEqual('0');
    expect(container.firstChild).toHaveTextContent('New Request to Hire');
  });

  it('opens a modal when button is clicked', async () => {
    const { container } = render(<NewRequestToHire />);
    await waitFor(() => container.firstChild);
    const button = getByText(container, 'New Request to Hire');
    fireEvent.click(button);

    const modal = await waitFor(() =>
      screen.getByTestId('newRequestToHireModal')
    );
    expect(modal).toBeVisible();
  });

  it('gets the job types', () => {
    expect(wrapper.state().jobTypes).toEqual([
      { id: 5, type: "B'nai Mitzvah", plural: "B'nai Mitzvahs" },
      { id: 7, type: 'Misc', plural: 'Misc' },
    ]);
  });

  it('gets the equipment', () => {
    expect(wrapper.state().equipment).toEqual([
      { id: 4, name: 'Camera' },
      { id: 6, name: 'Lights' },
    ]);
  });

  it('gets the skills', () => {
    expect(wrapper.state().skills).toEqual([
      { id: 9, name: 'Children' },
      { id: 5, name: 'Retouch' },
    ]);
  });

  it('opens the modal when button is clicked', () => {
    expect(wrapper.state().show).toBeFalsy();
    const button = wrapper.find('#openNewRequestToHireButton').at(0);
    expect(button.text()).toEqual('New Request to Hire');
    button.simulate('click');
    expect(wrapper.state().show).toBeTruthy();
  });

  it('has the correct modal header', () => {
    const button = wrapper.find('#openNewRequestToHireButton').at(0);
    button.simulate('click');
    const modal = wrapper.find(Modal);
    expect(modal.find('.modal-header').at(0).text()).toEqual(
      'Create a new request to hire'
    );
  });

  it('updates values when data is selected', () => {
    expect(wrapper.state().formData).toEqual({});
    const button = wrapper.find('#openNewRequestToHireButton').at(0);
    button.simulate('click');
    const modal = wrapper.find(Modal);
    modal.find('select').simulate('change', { target: { value: 'hello' } });
    expect(wrapper.state().formData).toEqual({ 'Job Type': 'hello' });
  });

  it('updates inputs when data is entered', () => {
    expect(wrapper.state().formData).toEqual({});
    const button = wrapper.find('#openNewRequestToHireButton').at(0);
    button.simulate('click');
    const modal = wrapper.find(Modal);
    const event = {
      preventDefault() {},
      target: { value: '100' },
    };
    modal.find('#formJobDetails').simulate('change', event);
    modal.find('#formPay').simulate('change', event);
    modal.find('#formDuration').simulate('change', event);
    expect(wrapper.state().formData).toEqual({
      Duration: '100',
      'Job Details': '100',
      Pay: '100',
    });
  });

  it('validates values when submitted', () => {
    expect(wrapper.state().validated).toBeFalsy();
    wrapper.find('#openNewRequestToHireButton').at(0).simulate('click');
    const button = wrapper.find(Modal).find('Button').at(1);
    expect(button.text()).toEqual('Create New Request');
    button.simulate('click');
    expect(wrapper.state().validated).toBeTruthy();
    expect(wrapper.state().show).toBeTruthy();
  });

  it('shows error messages on invalid inputs', async () => {
    wrapper.find('#openNewRequestToHireButton').at(0).simulate('click');
    await waitFor(() => wrapper.find('.invalid-feedback'));
    expect(wrapper.find('.invalid-feedback')).toHaveLength(6);
    expect(wrapper.find('.invalid-feedback').at(0).text()).toEqual(
      'Please provide a valid job type.'
    );
    expect(wrapper.find('.invalid-feedback').at(1).text()).toEqual(
      'Please provide a valid job details.'
    );
    expect(wrapper.find('.invalid-feedback').at(2).text()).toEqual(
      'Please provide a valid duration.'
    );
    expect(wrapper.find('.invalid-feedback').at(3).text()).toEqual(
      'Please provide a valid pay.'
    );
    expect(wrapper.find('.invalid-feedback').at(4).text()).toEqual(
      'Please provide a valid date.'
    );
    expect(wrapper.find('.invalid-feedback').at(5).text()).toEqual(
      'Please provide a valid time.'
    );
    wrapper.find(Modal).find('Button').at(1).simulate('click');
    await waitFor(() => wrapper.firstChild);
    for (let i = 0; i < 6; i++) {
      expect(
        wrapper.find('.invalid-feedback').at(i).getDOMNode()
      ).toBeVisible();
    }
  });

  // TODO - verify good data submits the form
});
