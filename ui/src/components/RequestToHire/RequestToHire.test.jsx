import React from 'react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import RequestToHire from './RequestToHire';

Enzyme.configure({ adapter: new Adapter() });

describe('snnap form input', () => {
  let wrapper;
  let wrapper1;

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
    wrapper1 = Enzyme.mount(
      <RequestToHire
        hireRequest={{
          id: 5,
          type: "B'nai Mitzvah",
          location: 'Fairfax, VA, United States of America',
          details: 'Some details',
          pay: 200,
          duration: 2,
          durationMax: 3,
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
    expect(content).toHaveLength(5);
    expect(content.at(0).text()).toEqual("B'nai Mitzvah");
    expect(content.at(1).text()).toEqual('Friday, March 04, 2022');
    expect(content.at(2).text()).toEqual('2 hours');
    expect(content.at(3).text()).toEqual('Submit For Job');
    expect(content.at(4).text()).toEqual('$200 per hour');
    expect(wrapper.find('.col-md-6').at(0).text()).toEqual('Fairfax, VA');
    expect(wrapper.find('.card-body').at(1).text()).toEqual('Some details');
  });

  it('displays the range detail', () => {
    const content = wrapper1.find('.col-md-3');
    expect(content).toHaveLength(5);
    expect(content.at(0).text()).toEqual("B'nai Mitzvah");
    expect(content.at(1).text()).toEqual('Friday, March 04, 2022');
    expect(content.at(2).text()).toEqual('2 to 3 hours');
    expect(content.at(3).text()).toEqual('Submit For Job');
    expect(content.at(4).text()).toEqual('$200 per hour');
    expect(wrapper.find('.col-md-6').at(0).text()).toEqual('Fairfax, VA');
    expect(wrapper.find('.card-body').at(1).text()).toEqual('Some details');
  });
});
