import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import { act } from 'react-dom/test-utils';
import AccountInformation from './AccountInformation';

jest.mock('../../../services/user.service');
const userService = require('../../../services/user.service');

Enzyme.configure({ adapter: new Adapter() });

describe('account information', () => {
  jest.setTimeout(10000);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('renders nothing when no values are passed', () => {
    const { container } = render(<AccountInformation />);
    expect(container.children).toHaveLength(0);
  });

  it('renders header properly', () => {
    const { container } = render(<AccountInformation user={{}} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(4);
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
    expect(container.firstChild.children[1].firstChild).toHaveClass('col-md-2');
    expect(container.firstChild.children[1].firstChild.children).toHaveLength(
      3
    );
    expect(container.firstChild.children[1].firstChild.firstChild).toHaveClass(
      'rounded-circle'
    );
    expect(
      container.firstChild.children[1].firstChild.firstChild.getAttribute('id')
    ).toEqual('avatar');
    // the rest is verified in Avatar.test.jsx
  });

  it('has readonly empty username in the first row', () => {
    const { container } = render(<AccountInformation user={{}} />);
    expect(container.firstChild.children[1].lastChild).toHaveClass('col-md-10');
    expect(container.firstChild.children[1].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[1].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('formUsername');
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'readOnly'
      )
    ).toEqual('');
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('text');
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'value'
      )
    ).toEqual('');
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'required'
      )
    ).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has readonly username in the first row', () => {
    const { container } = render(
      <AccountInformation user={{ username: 'msaperst' }} />
    );
    expect(container.firstChild.children[1].lastChild).toHaveClass('col-md-10');
    expect(container.firstChild.children[1].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[1].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[1].lastChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formUsername');
    expect(form.getAttribute('readOnly')).toEqual('');
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('msaperst');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 2 items in the second row', () => {
    const { container } = render(<AccountInformation user={{}} />);
    expect(container.firstChild.children[2]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[2].children).toHaveLength(2);
  });

  it('has email in the second row', () => {
    const { container } = render(
      <AccountInformation user={{ email: 'msaperst@gmail.com' }} />
    );
    expect(container.firstChild.children[2].firstChild).toHaveClass('col-md-6');
    expect(container.firstChild.children[2].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[2].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[2].firstChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formEmail');
    expect(form.getAttribute('readOnly')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('msaperst@gmail.com');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has number in the second row', () => {
    const { container } = render(
      <AccountInformation user={{ number: '1234567890' }} />
    );
    expect(container.firstChild.children[2].lastChild).toHaveClass('col-md-6');
    expect(container.firstChild.children[2].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[2].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[2].lastChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formNumber');
    expect(form.getAttribute('readOnly')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('1234567890');
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
    expect(spy).toHaveBeenCalledWith('msaperst@gmail.com', '1234567890');
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    expect(container.firstChild.lastChild.lastChild.firstChild).toHaveClass(
      'fade alert alert-danger alert-dismissible show'
    );
    expect(
      container.firstChild.lastChild.lastChild.firstChild.getAttribute('role')
    ).toEqual('alert');
    expect(
      container.firstChild.lastChild.lastChild.firstChild
    ).toHaveTextContent('Some Error');
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
    expect(spy).toHaveBeenCalledWith('msaperst@gmail.com', '1234567890');
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
      container.firstChild.children[2].firstChild.firstChild.firstChild,
      { target: { value: 'newEmail@gmail.com' } }
    );
    await fireEvent.change(
      container.firstChild.children[2].lastChild.firstChild.firstChild,
      { target: { value: '0987654321' } }
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('newEmail@gmail.com', '0987654321');
  });
});
