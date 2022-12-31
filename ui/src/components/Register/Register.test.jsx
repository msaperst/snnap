import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Register from './Register';
import { hasError } from '../Settings/CommonTestComponents';
import { selectFairfax } from '../CommonTestComponents';

jest.mock('../../services/authentication.service');
const authenticationService = require('../../services/authentication.service');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  // eslint-disable-next-line jsx-a11y/anchor-has-content,react/destructuring-assignment
  Link: (props) => <a {...props} href={props.to} />,
}));

describe('register', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('renders header properly', () => {
    const { container } = render(<Register />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(9);
    expect(container.firstChild.firstChild).toHaveTextContent('Register');
  });

  it('has 2 items in the first row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.children[1]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[1].children).toHaveLength(2);
  });

  it('has first name and last name in the first row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.children[1].firstChild).toHaveClass('col-md-5');
    expect(container.firstChild.children[1].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[1].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    let form =
      container.firstChild.children[1].firstChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formFirstname');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx

    expect(container.firstChild.children[1].lastChild).toHaveClass('col-md-7');
    expect(container.firstChild.children[1].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[1].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    form = container.firstChild.children[1].lastChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formLastname');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 1 item in the second row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.children[2]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[2].children).toHaveLength(1);
  });

  it('has city in the second row', () => {
    const { container } = render(<Register />);
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
      container.firstChild.children[2].firstChild.firstChild.children[1];
    expect(form.getAttribute('id')).toEqual('formCity');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('required')).toEqual('true');
    // the rest is verified in SnnapFormLocation.test.jsx
  });

  it('has 1 item in the third row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.children[3]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[3].children).toHaveLength(1);
  });

  it('has email in the third row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.children[3].firstChild).toHaveClass(
      'col-md-12'
    );
    expect(container.firstChild.children[3].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[3].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[3].lastChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formEmail');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('email');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has an empty fourth row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.children[4]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[4].children).toHaveLength(0);
  });

  it('has 1 item in the fifth row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.children[5]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[5].children).toHaveLength(1);
  });

  it('has username in the fifth row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.children[5].firstChild).toHaveClass(
      'col-md-12'
    );
    expect(container.firstChild.children[5].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[5].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[5].lastChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formUsername');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 1 item in the sixth row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.children[6]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[6].children).toHaveLength(1);
  });

  it('has password in the sixth row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.children[6].firstChild).toHaveClass(
      'col-md-12'
    );
    expect(container.firstChild.children[6].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[6].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[6].lastChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formPassword');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('password');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormPassword.test.jsx
  });

  it('has agree to conditions in the seventh row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.children[7].firstChild).toHaveClass(
      'form-check'
    );
    expect(container.firstChild.children[7].firstChild.children).toHaveLength(
      3
    );

    const form = container.firstChild.children[7].lastChild.firstChild;
    expect(form).toHaveClass('form-check-input');
    expect(form.getAttribute('id')).toEqual('agreeToTerms');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('checked')).toBeNull();
    expect(form.getAttribute('type')).toEqual('checkbox');
    expect(form.getAttribute('required')).toEqual('');

    const label = container.firstChild.children[7].lastChild.children[1];
    expect(label).toHaveClass('form-check-label');
    expect(label.getAttribute('for')).toEqual('agreeToTerms');
    expect(label.getAttribute('disabled')).toBeNull();
    expect(label.getAttribute('title')).toEqual('');
    expect(label).toHaveTextContent('Agree to terms of use');
  });

  it('has 2 items in the last row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.lastChild).toHaveClass('mb-3 row');
    expect(container.firstChild.lastChild.children).toHaveLength(2);
  });

  it('has save information button in the last row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.lastChild.firstChild).toHaveClass('col');
    expect(container.firstChild.lastChild.firstChild.firstChild).toHaveClass(
      'btn btn-primary'
    );
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('createAccountButton');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('submit');
    expect(
      container.firstChild.lastChild.firstChild.firstChild
    ).toHaveTextContent('Create Account');
  });

  it('has no alert or update present in the last row', () => {
    const { container } = render(<Register />);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
    expect(
      container.firstChild.children[1].firstChild.firstChild.firstChild
    ).toBeInvalid();
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild
    ).toBeInvalid();
    expect(
      container.firstChild.children[2].lastChild.firstChild.children[1]
    ).toBeInvalid();
    expect(
      container.firstChild.children[3].lastChild.firstChild.firstChild
    ).toBeInvalid();
    expect(
      container.firstChild.children[5].lastChild.firstChild.firstChild
    ).toBeInvalid();
    expect(
      container.firstChild.children[6].lastChild.firstChild.firstChild
    ).toBeInvalid();
    expect(container.firstChild.children[7].lastChild.firstChild).toBeInvalid();
  });

  it('does not submit if values are not present/valid', async () => {
    const { container } = render(<Register />);
    await act(async () => {
      fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    });
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('error displayed on non alphanumeric', async () => {
    const spy = jest.spyOn(
      authenticationService.authenticationService,
      'register'
    );
    const { container, getByText } = render(<Register />);
    await fillOutForm(
      container.firstChild,
      'email@example.org',
      'username*&^%',
      'password',
      getByText
    );
    expect(spy).toHaveBeenCalledTimes(0);
    hasError(
      container,
      'Username can only contain alpha numeric characters and underscores.'
    );
    expect(
      container.firstChild.children[5].lastChild.firstChild.firstChild
    ).toBeInvalid();
  });

  it('error displayed on no alphabets', async () => {
    const spy = jest.spyOn(
      authenticationService.authenticationService,
      'register'
    );
    const { container, getByText } = render(<Register />);
    await fillOutForm(
      container.firstChild,
      'email@example.org',
      '123456',
      'password',
      getByText
    );
    expect(spy).toHaveBeenCalledTimes(0);
    hasError(
      container,
      'Username must contain at least one alphabetical character.'
    );
    expect(
      container.firstChild.children[5].lastChild.firstChild.firstChild
    ).toBeInvalid();
  });

  it('error displayed on short password', async () => {
    const spy = jest.spyOn(
      authenticationService.authenticationService,
      'register'
    );
    const { container, getByText } = render(<Register />);
    await fillOutForm(
      container.firstChild,
      'email@example.org',
      'example',
      'passw',
      getByText
    );
    expect(spy).toHaveBeenCalledTimes(0);
    hasError(container, 'Password must be 6 or more characters.');
    expect(
      container.firstChild.children[6].lastChild.firstChild.firstChild
    ).toBeInvalid();
  });

  it('error displayed on no city', async () => {
    const spy = jest.spyOn(
      authenticationService.authenticationService,
      'register'
    );
    const { container } = render(<Register />);
    await fillOutForm(
      container.firstChild,
      'email@example.org',
      'example',
      'password'
    );
    expect(spy).toHaveBeenCalledTimes(0);
    hasError(container, 'Please select a valid city from the drop down.');
    expect(
      container.firstChild.children[2].lastChild.firstChild.children[1]
    ).toBeInvalid();
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(
      authenticationService.authenticationService,
      'register'
    );
    authenticationService.authenticationService.register.mockRejectedValue(
      'Some Error'
    );
    const { container, getByText } = render(<Register />);
    await fillOutForm(
      container.firstChild,
      'email@example.org',
      'username',
      'password',
      getByText
    );
    expect(spy).toHaveBeenCalledWith(
      'Max',
      'Saperstone',
      {
        lat: 38.8462236,
        loc: 'Fairfax, VA 20030, United States of America',
        lon: -77.3063733,
      },
      'email@example.org',
      'username',
      'password'
    );
    hasError(container);
    expect(
      container.firstChild.children[1].firstChild.firstChild.firstChild
    ).toBeValid();
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild
    ).toBeValid();
    expect(
      container.firstChild.children[2].firstChild.firstChild.children[1]
    ).toBeValid();
    expect(
      container.firstChild.children[3].firstChild.firstChild.firstChild
    ).toBeValid();
    expect(
      container.firstChild.children[5].firstChild.firstChild.firstChild
    ).toBeValid();
    expect(
      container.firstChild.children[6].firstChild.firstChild.firstChild
    ).toBeValid();
    expect(container.firstChild.children[7].firstChild.firstChild).toBeValid();
  });

  it('shows special error when duplicate email', async () => {
    authenticationService.authenticationService.register.mockRejectedValue(
      'This email is already in our system. Try resetting your password.'
    );
    const { container, getByText } = render(<Register />);
    await fillOutForm(
      container.firstChild,
      'email@example.org',
      'username',
      'password',
      getByText
    );
    hasError(
      container,
      'This email is already in our system. Try resetting your password.'
    );
    expect(
      container.firstChild.children[3].firstChild.firstChild.firstChild
    ).toBeInvalid();
  });

  it('shows special error when duplicate username', async () => {
    authenticationService.authenticationService.register.mockRejectedValue(
      'Sorry, that username is already in use.'
    );
    const { container, getByText } = render(<Register />);
    await fillOutForm(
      container.firstChild,
      'email@example.org',
      'username',
      'password',
      getByText
    );
    hasError(container, 'Sorry, that username is already in use.');
    expect(
      container.firstChild.children[5].firstChild.firstChild.firstChild
    ).toBeInvalid();
  });

  it('is able to close an alert after failure', async () => {
    authenticationService.authenticationService.register.mockRejectedValue(
      'Some Error'
    );
    const { container, getByText } = render(<Register />);
    await fillOutForm(
      container.firstChild,
      'email@example.org',
      'username',
      'password',
      getByText
    );
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    await fireEvent.click(
      container.firstChild.lastChild.lastChild.firstChild.firstChild
    );
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('forwards to homepage on success', async () => {
    authenticationService.authenticationService.register.mockResolvedValue();
    const { container, getByText } = render(<Register />);
    await fillOutForm(
      container.firstChild,
      'email@example.org',
      'username',
      'password',
      getByText
    );
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  async function fillOutForm(
    form,
    email,
    username,
    password,
    getByText = null
  ) {
    await act(async () => {
      fireEvent.change(form.children[1].firstChild.firstChild.firstChild, {
        target: { value: 'Max' },
      });
    });
    await act(async () => {
      fireEvent.change(form.children[1].lastChild.firstChild.firstChild, {
        target: { value: 'Saperstone' },
      });
    });
    await act(async () => {
      if (getByText) {
        const selectItem = selectFairfax(getByText);
        await selectItem(form.children[2].firstChild.firstChild.children[1]);
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        fireEvent.change(form.children[2].firstChild.firstChild.children[1], {
          target: { value: 'fairfax' },
        });
      }
    });
    await act(async () => {
      fireEvent.change(form.children[3].lastChild.firstChild.firstChild, {
        target: { value: email },
      });
    });
    await act(async () => {
      fireEvent.change(form.children[5].lastChild.firstChild.firstChild, {
        target: { value: username },
      });
    });
    await act(async () => {
      fireEvent.change(form.children[6].lastChild.firstChild.firstChild, {
        target: { value: password },
      });
    });
    await act(async () => {
      fireEvent.click(form.children[7].firstChild.firstChild);
    });
    await act(async () => {
      fireEvent.click(form.lastChild.firstChild.firstChild);
    });
  }
});
