import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import { act } from 'react-dom/test-utils';
import Password from './Password';
import { hasError } from '../CommonTestComponents';

jest.mock('../../../services/user.service');
const userService = require('../../../services/user.service');

Enzyme.configure({ adapter: new Adapter() });

describe('personal information', () => {
  jest.setTimeout(10000);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('renders header properly', () => {
    const { container } = render(<Password />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(4);
    expect(container.firstChild.firstChild).toHaveTextContent('Password');
  });

  it('has 1 item in the first row', () => {
    const { container } = render(<Password />);
    expect(container.firstChild.children[1]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[1].children).toHaveLength(1);
  });

  it('has empty current password in the first row', () => {
    const { container } = render(<Password />);
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
    expect(form.getAttribute('id')).toEqual('formCurrentPassword');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('password');
    expect(form.getAttribute('value')).toEqual('');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 1 item in the second row', () => {
    const { container } = render(<Password />);
    expect(container.firstChild.children[2]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[2].children).toHaveLength(1);
  });

  it('has new password in the second row', () => {
    const { container } = render(<Password />);
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
    expect(form.getAttribute('id')).toEqual('formNewPassword');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('password');
    expect(form.getAttribute('value')).toEqual('');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 2 items in the last row', () => {
    const { container } = render(<Password />);
    expect(container.firstChild.lastChild).toHaveClass('mb-3 row');
    expect(container.firstChild.lastChild.children).toHaveLength(2);
  });

  it('has save information button in the last row', () => {
    const { container } = render(<Password />);
    expect(container.firstChild.lastChild.firstChild).toHaveClass('col');
    expect(container.firstChild.lastChild.firstChild.firstChild).toHaveClass(
      'btn btn-primary'
    );
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('updatePasswordButton');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('submit');
    expect(
      container.firstChild.lastChild.firstChild.firstChild
    ).toHaveTextContent('Update Password');
  });

  it('has no alert or update present in the last row', () => {
    const { container } = render(<Password />);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('does not submit if values are not present/valid', async () => {
    const { container } = render(<Password />);
    await fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(userService.userService, 'updatePassword');
    userService.userService.updatePassword.mockRejectedValue('Some Error');
    const { container } = render(<Password />);
    await fireEvent.change(
      container.firstChild.children[1].firstChild.firstChild.firstChild,
      { target: { value: 'current password' } }
    );
    await fireEvent.change(
      container.firstChild.children[2].firstChild.firstChild.firstChild,
      { target: { value: 'new password' } }
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('current password', 'new password');
    hasError(container);
  });

  it('is able to close an alert after failure', async () => {
    userService.userService.updatePassword.mockRejectedValue('Some Error');
    const { container } = render(<Password />);
    await fireEvent.change(
      container.firstChild.children[1].firstChild.firstChild.firstChild,
      { target: { value: 'current password' } }
    );
    await fireEvent.change(
      container.firstChild.children[2].firstChild.firstChild.firstChild,
      { target: { value: 'new password' } }
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
    const spy = jest.spyOn(userService.userService, 'updatePassword');
    userService.userService.updatePassword.mockResolvedValue('Some Success');
    const { container } = render(<Password />);
    await fireEvent.change(
      container.firstChild.children[1].firstChild.firstChild.firstChild,
      { target: { value: 'current password' } }
    );
    await fireEvent.change(
      container.firstChild.children[2].firstChild.firstChild.firstChild,
      { target: { value: 'new password' } }
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('current password', 'new password');
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
    ).toHaveTextContent('Password Updated');
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
    userService.userService.updatePassword.mockResolvedValue('Some Success');
    const { container } = render(<Password />);
    await fireEvent.change(
      container.firstChild.children[1].firstChild.firstChild.firstChild,
      { target: { value: 'current password' } }
    );
    await fireEvent.change(
      container.firstChild.children[2].firstChild.firstChild.firstChild,
      { target: { value: 'new password' } }
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
    userService.userService.updatePassword.mockResolvedValue('Some Success');
    const { container } = render(<Password />);
    await fireEvent.change(
      container.firstChild.children[1].firstChild.firstChild.firstChild,
      { target: { value: 'current password' } }
    );
    await fireEvent.change(
      container.firstChild.children[2].firstChild.firstChild.firstChild,
      { target: { value: 'new password' } }
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
    const spy = jest.spyOn(userService.userService, 'updatePassword');
    userService.userService.updatePassword.mockResolvedValue('Some Success');
    const { container } = render(<Password />);
    await fireEvent.change(
      container.firstChild.children[1].firstChild.firstChild.firstChild,
      { target: { value: 'current password' } }
    );
    await fireEvent.change(
      container.firstChild.children[2].firstChild.firstChild.firstChild,
      { target: { value: 'new password' } }
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('current password', 'new password');
  });
});
