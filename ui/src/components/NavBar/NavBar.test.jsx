import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import NavBar from './NavBar';

describe('<NavBar/>', () => {
  let navbar;

  beforeEach(() => {
    navbar = render(<NavBar />);
  });

  it('returns nothing without a user', () => {
    expect(navbar.text).toEqual(undefined);
  });
});
