import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('<App/>', () => {
  test('displays the basic login page', () => {
    render(<App />);
    const linkElement = screen.getAllByText(/login/i);
    expect(linkElement).toHaveLength(2);
  });

  test('displays the home page', () => {
    localStorage.setItem('currentUser', { username: 'max' });
    render(<App />);
    const linkElement = screen.getAllByText(/login/i);
    expect(linkElement).toHaveLength(2);
  });
});
