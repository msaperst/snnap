import React from 'react';
import { render } from '@testing-library/react';
import Search from './Search';

describe('search', () => {
  let search;

  beforeEach(() => {
    search = render(<Search />);
  });

  it('displays the main tagline', async () => {
    expect(search.queryByText(/Photography help in a snap/)).toBeTruthy();
  });

  it('displays search bar', async () => {
    expect(search.queryByLabelText(/Search For Job/)).toBeTruthy();
  });
});
