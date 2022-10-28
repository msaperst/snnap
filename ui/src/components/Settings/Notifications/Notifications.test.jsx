import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import Notifications from './Notifications';
import { hasError } from '../CommonTestComponents';

jest.mock('../../../services/user.service');
const userService = require('../../../services/user.service');

describe('notification settings', () => {
  jest.setTimeout(10000);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('renders nothing when no values are passed', () => {
    const { container } = render(<Notifications />);
    expect(container.children).toHaveLength(0);
  });

  it('renders header properly', () => {
    const { container } = render(<Notifications settings={{}} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(4);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Notification Settings'
    );
  });

  it('has 1 item in the first row', () => {
    const { container } = render(<Notifications settings={{}} />);
    expect(container.firstChild.children[1]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[1].children).toHaveLength(1);
  });

  it('has unchecked email in the first row', () => {
    const { container } = render(<Notifications settings={{}} />);
    expect(container.firstChild.children[1].firstChild).toHaveClass(
      'form-check'
    );
    expect(container.firstChild.children[1].firstChild.children).toHaveLength(
      2
    );

    const checkbox = container.firstChild.children[1].firstChild.firstChild;
    expect(checkbox).toHaveClass('form-check-input');
    expect(checkbox.getAttribute('id')).toEqual('emailNotifications');
    expect(checkbox.getAttribute('type')).toEqual('checkbox');
    expect(checkbox.getAttribute('checked')).toBeNull();
    expect(checkbox.getAttribute('disabled')).toBeNull();

    const label = container.firstChild.children[1].firstChild.lastChild;
    expect(label).toHaveClass('form-check-label');
    expect(label.getAttribute('title')).toEqual('');
    expect(label.getAttribute('for')).toEqual('emailNotifications');
    expect(label).toHaveTextContent('Email Notifications');
  });

  it('has checked email when provided', () => {
    const { container } = render(
      <Notifications settings={{ email_notifications: true }} />
    );
    expect(
      container.firstChild.children[1].firstChild.firstChild.getAttribute(
        'checked'
      )
    ).toEqual('');
  });

  it('has checked email when provided as digit', () => {
    const { container } = render(
      <Notifications settings={{ email_notifications: 1 }} />
    );
    expect(
      container.firstChild.children[1].firstChild.firstChild.getAttribute(
        'checked'
      )
    ).toEqual('');
  });

  it('has 1 item in the second row', () => {
    const { container } = render(<Notifications settings={{}} />);
    expect(container.firstChild.children[1]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[1].children).toHaveLength(1);
  });

  it('has unchecked push in the second row', () => {
    const { container } = render(<Notifications settings={{}} />);
    expect(container.firstChild.children[2].firstChild).toHaveClass(
      'form-check'
    );
    expect(container.firstChild.children[2].firstChild.children).toHaveLength(
      2
    );

    const checkbox = container.firstChild.children[2].firstChild.firstChild;
    expect(checkbox).toHaveClass('form-check-input');
    expect(checkbox.getAttribute('id')).toEqual('pushNotifications');
    expect(checkbox.getAttribute('type')).toEqual('checkbox');
    expect(checkbox.getAttribute('checked')).toBeNull();
    expect(checkbox.getAttribute('disabled')).toEqual('');

    const label = container.firstChild.children[2].firstChild.lastChild;
    expect(label).toHaveClass('form-check-label');
    expect(label.getAttribute('title')).toEqual('');
    expect(label.getAttribute('for')).toEqual('pushNotifications');
    expect(label).toHaveTextContent('Push Notifications');
  });

  it('has checked push when provided', () => {
    const { container } = render(
      <Notifications settings={{ push_notifications: true }} />
    );
    expect(
      container.firstChild.children[2].firstChild.firstChild.getAttribute(
        'checked'
      )
    ).toEqual('');
  });

  it('has checked push when provided as digit', () => {
    const { container } = render(
      <Notifications settings={{ push_notifications: 1 }} />
    );
    expect(
      container.firstChild.children[2].firstChild.firstChild.getAttribute(
        'checked'
      )
    ).toEqual('');
  });

  it('has 2 items in the last row', () => {
    const { container } = render(<Notifications settings={{}} />);
    expect(container.firstChild.lastChild).toHaveClass('mb-3 row');
    expect(container.firstChild.lastChild.children).toHaveLength(2);
  });

  it('has save information button in the last row', () => {
    const { container } = render(<Notifications settings={{}} />);
    expect(container.firstChild.lastChild.firstChild).toHaveClass('col');
    expect(container.firstChild.lastChild.firstChild.firstChild).toHaveClass(
      'btn btn-primary'
    );
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('saveNotificationSettingsButton');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('submit');
    expect(
      container.firstChild.lastChild.firstChild.firstChild
    ).toHaveTextContent('Save Notification Settings');
  });

  it('has no alert or update present in the last row', () => {
    const { container } = render(<Notifications settings={{}} />);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(
      userService.userService,
      'updateNotificationSettings'
    );
    userService.userService.updateNotificationSettings.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(<Notifications settings={{}} />);
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith(false, false);
    hasError(container);
  });

  it('is able to close an alert after failure', async () => {
    userService.userService.updateNotificationSettings.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(<Notifications settings={{}} />);
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
    const spy = jest.spyOn(
      userService.userService,
      'updateNotificationSettings'
    );
    userService.userService.updateNotificationSettings.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(<Notifications settings={{}} />);
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith(false, false);
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
    ).toHaveTextContent('Notification Settings Updated');
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
    userService.userService.updateNotificationSettings.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(<Notifications settings={{}} />);
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
    userService.userService.updateNotificationSettings.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(<Notifications settings={{}} />);
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

  it('can handle setting of unset values', async () => {
    const spy = jest.spyOn(
      userService.userService,
      'updateNotificationSettings'
    );
    userService.userService.updateNotificationSettings.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(<Notifications settings={{}} />);
    await fireEvent.click(
      container.firstChild.children[1].firstChild.firstChild
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith(true, false);
  });

  it('can handle unsetting of set values', async () => {
    const spy = jest.spyOn(
      userService.userService,
      'updateNotificationSettings'
    );
    userService.userService.updateNotificationSettings.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <Notifications settings={{ email_notifications: true }} />
    );
    await fireEvent.click(
      container.firstChild.children[1].firstChild.firstChild
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith(false, false);
  });
});
