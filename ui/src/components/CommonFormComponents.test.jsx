import React from 'react';
import '@testing-library/jest-dom';
import { commonFormComponents } from './CommonFormComponents';

const mockedReactGa4 = jest.fn();
jest.mock('react-ga4', () => ({
  ...jest.requireActual('react-ga4'),
  send: () => mockedReactGa4,
}));

describe('common form components', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('gets called with homepage', () => {
    // const spy = jest.spyOn(mock, 'send');
    commonFormComponents.setPageView('/');
    expect(mockedReactGa4).toHaveBeenCalledWith('Homepage');
  });
});
