import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Search from './Search';

Enzyme.configure({ adapter: new Adapter() });

describe('search', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = Enzyme.shallow(<Search />);
  });

  it('displays the main tagline', async () => {
    expect(wrapper.find('#tagline').text()).toEqual(
      'Photography help in a snap'
    );
  });

  it('displays the next tagline', async () => {
    expect(wrapper.find('#subTagline').text()).toEqual(
      'The extra n is for easy'
    );
  });

  it('displays search bar', async () => {
    const search = render(<Search />);
    expect(search.queryByLabelText(/Search For Job/)).toBeTruthy();
  });
});
