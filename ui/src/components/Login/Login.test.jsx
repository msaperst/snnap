import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useLocation } from 'react-router-dom';
import Login from './Login';
import { hasError } from '../Settings/CommonTestComponents';

jest.mock('../../services/authentication.service');
const authenticationService = require('../../services/authentication.service');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: jest.fn(),
  // eslint-disable-next-line jsx-a11y/anchor-has-content,react/destructuring-assignment
  Link: (props) => <a {...props} href={props.to} />,
}));

describe('login', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    useLocation.mockImplementation(() => jest.fn());
  });

  it('renders header properly', () => {
    const { container } = render(<Login />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(5);
    expect(container.firstChild.firstChild).toHaveTextContent('Login');
  });

  it('has 1 item in the first row', () => {
    const { container } = render(<Login />);
    expect(container.firstChild.children[1]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[1].children).toHaveLength(1);
  });

  it('has username in the first row', () => {
    const { container } = render(<Login />);
    expect(container.firstChild.children[1].firstChild).toHaveClass(
      'col-md-12'
    );
    expect(container.firstChild.children[1].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[1].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[1].firstChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formUsername');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 1 item in the second row', () => {
    const { container } = render(<Login />);
    expect(container.firstChild.children[2]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[2].children).toHaveLength(1);
  });

  it('has password in the second row', () => {
    const { container } = render(<Login />);
    expect(container.firstChild.children[2].firstChild).toHaveClass(
      'col-md-12'
    );
    expect(container.firstChild.children[2].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[2].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[2].firstChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formPassword');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('password');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 2 items in the third row', () => {
    const { container } = render(<Login />);
    expect(container.firstChild.children[3]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[3].children).toHaveLength(2);
  });

  it('has remember me and forgot password in the third row', () => {
    const { container } = render(<Login />);

    expect(container.firstChild.children[3].firstChild).toHaveClass('col-5');
    expect(container.firstChild.children[3].firstChild.firstChild).toHaveClass(
      'form-check'
    );
    expect(container.firstChild.children[3].firstChild.children).toHaveLength(
      1
    );
    expect(
      container.firstChild.children[3].firstChild.firstChild.children
    ).toHaveLength(2);

    const form =
      container.firstChild.children[3].firstChild.firstChild.firstChild;
    expect(form).toHaveClass('form-check-input');
    expect(form.getAttribute('id')).toEqual('rememberMe');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('checked')).toEqual('');
    expect(form.getAttribute('type')).toEqual('checkbox');
    expect(form.getAttribute('required')).toBeNull();

    const label =
      container.firstChild.children[3].firstChild.firstChild.lastChild;
    expect(label).toHaveClass('form-check-label');
    expect(label.getAttribute('for')).toEqual('rememberMe');
    expect(label.getAttribute('disabled')).toBeNull();
    expect(label.getAttribute('title')).toEqual('');
    expect(label).toHaveTextContent('Remember Me');

    expect(container.firstChild.children[3].lastChild).toHaveClass(
      'text-end col-7'
    );
    expect(container.firstChild.children[3].lastChild.children).toHaveLength(1);
    const link = container.firstChild.children[3].lastChild.firstChild;
    expect(link.getAttribute('disabled')).toBeNull();
    expect(link).toHaveTextContent('Forgot Password');
  });

  it('has 2 items in the last row', () => {
    const { container } = render(<Login />);
    expect(container.firstChild.lastChild).toHaveClass('mb-3 row');
    expect(container.firstChild.lastChild.children).toHaveLength(2);
  });

  it('has save information button in the last row', () => {
    const { container } = render(<Login />);
    expect(container.firstChild.lastChild.firstChild).toHaveClass('col');
    expect(container.firstChild.lastChild.firstChild.firstChild).toHaveClass(
      'btn btn-primary'
    );
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('loginButton');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('submit');
    expect(
      container.firstChild.lastChild.firstChild.firstChild
    ).toHaveTextContent('Login');
  });

  it('has no alert or update present in the last row', () => {
    const { container } = render(<Login />);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('does not submit if values are not present/valid', async () => {
    const { container } = render(<Login />);
    await fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('captures changing value of remember me', async () => {
    const spy = jest.spyOn(
      authenticationService.authenticationService,
      'login'
    );
    authenticationService.authenticationService.login.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(<Login />);
    fireEvent.click(
      container.firstChild.children[3].firstChild.firstChild.firstChild
    );
    await fillOutForm(container.firstChild);
    expect(spy).toHaveBeenCalledWith('username', 'password', false);
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(
      authenticationService.authenticationService,
      'login'
    );
    authenticationService.authenticationService.login.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(<Login />);
    await fillOutForm(container.firstChild);
    expect(spy).toHaveBeenCalledWith('username', 'password', true);
    hasError(container);
  });

  it('is able to close an alert after failure', async () => {
    authenticationService.authenticationService.login.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(<Login />);
    await fillOutForm(container.firstChild);
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    await fireEvent.click(
      container.firstChild.lastChild.lastChild.firstChild.firstChild
    );
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('forwards to default on success', async () => {
    authenticationService.authenticationService.login.mockResolvedValue();
    const { container } = render(<Login />);
    await fillOutForm(container.firstChild);
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
    expect(mockedNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('forwards to default without from', async () => {
    useLocation.mockReturnValue({
      state: '/path',
    });
    authenticationService.authenticationService.login.mockResolvedValue();
    const { container } = render(<Login />);
    await fillOutForm(container.firstChild);
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
    expect(mockedNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('forwards to default without pathname', async () => {
    useLocation.mockReturnValue({
      state: { from: '/path' },
    });
    authenticationService.authenticationService.login.mockResolvedValue();
    const { container } = render(<Login />);
    await fillOutForm(container.firstChild);
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
    expect(mockedNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('forwards to homepage on success', async () => {
    useLocation.mockReturnValue({
      state: { from: { pathname: '/path' } },
    });
    authenticationService.authenticationService.login.mockResolvedValue();
    const { container } = render(<Login />);
    await fillOutForm(container.firstChild);
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
    expect(mockedNavigate).toHaveBeenCalledWith('/path', { replace: true });
  });

  async function fillOutForm(form) {
    fireEvent.change(form.children[1].firstChild.firstChild.firstChild, {
      target: { value: 'username' },
    });
    fireEvent.change(form.children[2].firstChild.firstChild.firstChild, {
      target: { value: 'password' },
    });
    await act(async () => {
      fireEvent.click(form.lastChild.firstChild.firstChild);
    });
  }
});
