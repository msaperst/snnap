import React from 'react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import RequestToHire from './RequestToHire';

Enzyme.configure({ adapter: new Adapter() });

describe('snnap form input', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = Enzyme.mount(
      <RequestToHire
        hireRequest={{
          id: 5,
          type: "B'nai Mitzvah",
          location: 'Fairfax, VA, United States of America',
          details: 'Some details',
          pay: 200,
          duration: 2,
          units: 'Hours',
          date_time: '2022-03-04T23:40:00.000Z',
          equipment: '',
          skills: '',
          user: 4,
          typeId: 5,
        }}
      />
    );
  });

  it('displays the basic detail', () => {
    const content = wrapper.find('.col-md-3');
    expect(content).toHaveLength(7);
    expect(content.at(0).text()).toEqual("B'nai Mitzvah");
    expect(content.at(1).text()).toEqual('Friday, March 04, 2022');
    expect(content.at(2).text()).toEqual('2 Hours');
    expect(content.at(3).text()).toEqual('Submit For Job');
    expect(content.at(4).text()).toEqual('Fairfax, VA');
    expect(content.at(5).text()).toContain(':40:00 PM'); // TODO - fix for checking different timezones
    expect(content.at(6).text()).toEqual('$200');
    expect(wrapper.find('.card-body').at(1).text()).toEqual('Some details');
  });
});
