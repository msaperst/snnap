import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Search from './Search';

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

Enzyme.configure({ adapter: new Adapter() });

describe('search', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jobService.jobService.getJobTypes.mockResolvedValue([
      { id: 5, type: "B'nai Mitzvah", plural: "B'nai Mitzvahs" },
      { id: 7, type: 'Misc', plural: 'Misc' },
    ]);
    wrapper = Enzyme.shallow(<Search />);
  });

  it('displays the main tagline', () => {
    expect(wrapper.find('#tagline').text()).toEqual(
      'Photography help in a snap'
    );
  });

  it('displays the next tagline', () => {
    expect(wrapper.find('#subTagline').text()).toEqual(
      'The extra n is for easy'
    );
  });

  it('displays search bar', () => {
    const search = render(<Search />);
    expect(search.queryByLabelText(/Search For Job/)).toBeTruthy();
  });

  it('displays each button', () => {
    const buttons = wrapper.find('Button');
    expect(buttons).toHaveLength(3);
    // first button is search
    expect(buttons.at(0).text()).toEqual('<FaSearch />');
    // other buttons are returned plural values
    expect(buttons.at(1).text()).toEqual("B'nai Mitzvahs");
    expect(buttons.at(2).text()).toEqual('Misc');
  });

  it('gets the job types', () => {
    expect(wrapper.state().jobTypes).toEqual([
      { id: 5, type: "B'nai Mitzvah", plural: "B'nai Mitzvahs" },
      { id: 7, type: 'Misc', plural: 'Misc' },
    ]);
  });

  it('does something when a filter button is clicked', () => {
    wrapper.find('Button').at(1).simulate('click');
    // TODO - verify something happened
  });
});
