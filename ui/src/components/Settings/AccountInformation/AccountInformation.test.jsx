import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import AccountInformation from './AccountInformation';
import { hasError } from '../CommonTestComponents';

jest.mock('../../../services/user.service');
const userService = require('../../../services/user.service');

const fakeLocalStorage = (function () {
  let store = {};

  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

describe('account information', () => {
  jest.setTimeout(10000);

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: fakeLocalStorage,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    localStorage.setItem('currentUser', JSON.stringify({}));
  });

  it('renders nothing when no values are passed', () => {
    const { container } = render(<AccountInformation />);
    expect(container.children).toHaveLength(0);
  });

  it('renders header properly', () => {
    const { container } = render(<AccountInformation user={{}} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(3);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Account Information'
    );
  });

  it('has 2 items in the first row', () => {
    const { container } = render(<AccountInformation user={{}} />);
    expect(container.firstChild.children[1]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[1].children).toHaveLength(2);
  });

  it('has avatar in the first row', () => {
    const { container } = render(<AccountInformation user={{}} />);
    expect(container.firstChild.children[1].firstChild).toHaveClass('col-md-3');
    expect(container.firstChild.children[1].firstChild.children).toHaveLength(
      2
    );
    expect(container.firstChild.children[1].firstChild.firstChild).toHaveClass(
      'circle'
    );
    // the rest is verified in Avatar.test.jsx
  });

  it('has username and email in the first row', () => {
    const { container } = render(<AccountInformation user={{}} />);
    expect(container.firstChild.children[1].lastChild).toHaveClass('col-md-9');
    expect(container.firstChild.children[1].lastChild.children).toHaveLength(2);
  });

  it('has disabled empty username in the first row', () => {
    const { container } = render(<AccountInformation user={{}} />);
    expect(container.firstChild.children[1].lastChild.firstChild).toHaveClass(
      'mb-3 row'
    );

    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild
    ).toHaveClass('col-md-12');

    expect(
      container.firstChild.children[1].lastChild.firstChild.children
    ).toHaveLength(1);
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild
        .firstChild
    ).toHaveClass('form-floating');
    const form =
      container.firstChild.children[1].lastChild.firstChild.firstChild
        .firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formUsername');
    expect(form.getAttribute('disabled')).toEqual('');
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has disabled username in the first row', () => {
    const { container } = render(
      <AccountInformation user={{ username: 'msaperst' }} />
    );
    expect(container.firstChild.children[1].lastChild.firstChild).toHaveClass(
      'mb-3 row'
    );
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild
    ).toHaveClass('col-md-12');
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.children
    ).toHaveLength(1);
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild
        .firstChild
    ).toHaveClass('form-floating');
    const form =
      container.firstChild.children[1].lastChild.firstChild.firstChild
        .firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formUsername');
    expect(form.getAttribute('disabled')).toEqual('');
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('msaperst');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has email in the second row', () => {
    const { container } = render(
      <AccountInformation user={{ email: 'msaperst@gmail.com' }} />
    );
    expect(container.firstChild.children[1].lastChild.lastChild).toHaveClass(
      'row'
    );
    expect(
      container.firstChild.children[1].lastChild.lastChild.firstChild
    ).toHaveClass('col-md-12');
    expect(
      container.firstChild.children[1].lastChild.lastChild.firstChild.children
    ).toHaveLength(1);
    expect(
      container.firstChild.children[1].lastChild.lastChild.firstChild.firstChild
    ).toHaveClass('form-floating');
    const form =
      container.firstChild.children[1].lastChild.lastChild.firstChild.firstChild
        .firstChild;
    expect(form.getAttribute('id')).toEqual('formEmail');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('msaperst@gmail.com');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 2 items in the last row', () => {
    const { container } = render(<AccountInformation user={{}} />);
    expect(container.firstChild.lastChild).toHaveClass('mb-3 row');
    expect(container.firstChild.lastChild.children).toHaveLength(2);
  });

  it('has save information button in the last row', () => {
    const { container } = render(<AccountInformation user={{}} />);
    expect(container.firstChild.lastChild.firstChild).toHaveClass('col');
    expect(container.firstChild.lastChild.firstChild.firstChild).toHaveClass(
      'btn btn-primary'
    );
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('saveAccountInformationButton');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('submit');
    expect(
      container.firstChild.lastChild.firstChild.firstChild
    ).toHaveTextContent('Save Account Information');
  });

  it('has no alert or update present in the last row', () => {
    const { container } = render(<AccountInformation user={{}} />);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('does not submit if values are not present/valid', async () => {
    const { container } = render(<AccountInformation user={{}} />);
    await fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(userService.userService, 'updateAccountInformation');
    userService.userService.updateAccountInformation.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(
      <AccountInformation
        user={{
          username: 'msaperst',
          email: 'msaperst@gmail.com',
          number: '1234567890',
        }}
      />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('msaperst@gmail.com');
    hasError(container);
  });

  it('is able to close an alert after failure', async () => {
    userService.userService.updateAccountInformation.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(
      <AccountInformation
        user={{
          username: 'msaperst',
          email: 'msaperst@gmail.com',
          number: '1234567890',
        }}
      />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    await fireEvent.click(
      container.firstChild.lastChild.lastChild.firstChild.firstChild
    );
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('has an alert on success of a submission', async () => {
    const spy = jest.spyOn(userService.userService, 'updateAccountInformation');
    userService.userService.updateAccountInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <AccountInformation
        user={{
          username: 'msaperst',
          email: 'msaperst@gmail.com',
          number: '1234567890',
        }}
      />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('msaperst@gmail.com');
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    expect(container.firstChild.lastChild.lastChild.firstChild).toHaveClass(
      'fade alert alert-success alert-dismissible show'
    );
    expect(
      container.firstChild.lastChild.lastChild.firstChild.getAttribute('role')
    ).toEqual('alert');
    expect(
      container.firstChild.lastChild.lastChild.firstChild
    ).toHaveTextContent('Account Information Updated');
    expect(
      container.firstChild.lastChild.lastChild.firstChild.children
    ).toHaveLength(1);
    expect(
      container.firstChild.lastChild.lastChild.firstChild.firstChild.getAttribute(
        'aria-label'
      )
    ).toEqual('Close alert');
    expect(
      container.firstChild.lastChild.lastChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('button');
    expect(
      container.firstChild.lastChild.lastChild.firstChild.firstChild
    ).toHaveClass('btn-close');
  });

  it('is able to close an alert after success', async () => {
    userService.userService.updateAccountInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <AccountInformation
        user={{
          username: 'msaperst',
          email: 'msaperst@gmail.com',
          number: '1234567890',
        }}
      />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    await fireEvent.click(
      container.firstChild.lastChild.lastChild.firstChild.firstChild
    );
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('removes the success alert after 5 seconds', async () => {
    userService.userService.updateAccountInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <AccountInformation
        user={{
          username: 'msaperst',
          email: 'msaperst@gmail.com',
          number: '1234567890',
        }}
      />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    await act(async () => {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 5000));
    });
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('can handle changing of values', async () => {
    const spy = jest.spyOn(userService.userService, 'updateAccountInformation');
    userService.userService.updateAccountInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <AccountInformation
        user={{
          username: 'msaperst',
          email: 'msaperst@gmail.com',
          number: '1234567890',
        }}
      />
    );
    await fireEvent.change(
      container.firstChild.children[1].lastChild.lastChild.firstChild.firstChild
        .firstChild,
      { target: { value: 'newEmail@gmail.com' } }
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('newEmail@gmail.com');
  });
});
