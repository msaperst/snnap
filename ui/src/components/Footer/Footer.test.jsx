import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Footer from './Footer';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  // eslint-disable-next-line jsx-a11y/anchor-has-content,react/destructuring-assignment
  Link: (props) => <a {...props} href={props.to} />,
}));

describe('footer', () => {
  it('has the correct content', () => {
    const { container } = render(<Footer />);
    expect(container).toHaveTextContent(
      'Copyright © SNNAP 2024Privacy Policy | Terms of Use',
    );
  });
});
