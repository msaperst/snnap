import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Search from './Search';

describe('search', () => {
  let x;

  beforeEach(() => {
    x = 0;
  });

  it('displays the main tagline', () => {
    const search = render(<Search />);
    const tag = search.getByText('Photography help in a snap');
    expect(tag.getAttribute('id')).toEqual('tagline');
  });

  it('displays the next tagline', () => {
    const search = render(<Search />);
    const sub = search.getByText('The extra n is for easy');
    expect(sub.getAttribute('id')).toEqual('subTagline');
  });

  it('displays search bar', () => {
    const search = render(<Search />);
    expect(search.queryByLabelText('Search For Job')).toBeTruthy();
  });

  it('displays each button', () => {
    render(<Search filter={updateX} />);
    const searchButton = screen.getByRole('button');
    expect(searchButton).toHaveClass('btn btn-primary');
    expect(searchButton.getAttribute('id')).toEqual('searchForJobButton');
    expect(searchButton.getAttribute('type')).toEqual('submit');
    expect(searchButton).toHaveTextContent('');
  });

  it('does nothing when submitted', () => {
    render(<Search filter={updateX} />);
    const searchButton = screen.getByRole('button');
    fireEvent.click(searchButton);
    expect(x).toEqual(0);
  });

  it('updates the filter when values are entered', () => {
    render(<Search filter={updateX} />);
    fireEvent.change(screen.getByLabelText('Search For Job'), {
      target: { value: '123' },
    });
    expect(x).toEqual('123');
  });

  const updateX = (e) => {
    x = e.target.value;
  };
});
