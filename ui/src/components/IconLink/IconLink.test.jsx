import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Facebook } from 'react-bootstrap-icons';
import IconLink from './IconLink';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  // eslint-disable-next-line jsx-a11y/anchor-has-content,react/destructuring-assignment
  Link: (props) => <a {...props} href={props.to} />,
}));

describe('icon link', () => {
  it('displays nothing when no link', () => {
    const { container } = render(<IconLink />);
    expect(container.children).toHaveLength(0);
  });

  it('has link with link', () => {
    const { container } = render(<IconLink link="https://facebook.com" />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild.getAttribute('href')).toEqual(
      'https://facebook.com'
    );
    expect(container.firstChild.firstChild.getAttribute('target')).toEqual(
      '_blank'
    );
    expect(container.firstChild.firstChild.getAttribute('rel')).toEqual(
      'noreferrer'
    );
    expect(container.firstChild.firstChild.children).toHaveLength(0);
  });

  it('adds http when link without', () => {
    const { container } = render(<IconLink link="facebook.com" />);
    expect(container.firstChild.firstChild.getAttribute('href')).toEqual(
      'http://facebook.com'
    );
  });

  it('has icon when provided', () => {
    const { container } = render(
      <IconLink link="https://facebook.com" icon={<Facebook />} />
    );
    expect(container.firstChild.firstChild.children).toHaveLength(1);
  });
});
