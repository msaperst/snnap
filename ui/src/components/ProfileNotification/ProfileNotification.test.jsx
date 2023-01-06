import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ProfileNotification from './ProfileNotification';
import { closeModal } from '../CommonTestComponents';

jest.mock('../../services/company.service');
const companyService = require('../../services/company.service');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  // eslint-disable-next-line jsx-a11y/anchor-has-content,react/destructuring-assignment
  Link: (props) => <a {...props} href={props.to} />,
}));

describe('profile notification modal', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    companyService.companyService.get.mockResolvedValue();
  });

  async function loadProfileNotification() {
    await act(async () => {
      const { container } = render(<ProfileNotification />);
      await waitFor(() => container.firstChild);
    });
    return waitFor(() =>
      screen.queryAllByTestId('setUpProfileNotificationModal')
    );
  }

  it('does not show the modal with an empty company response', async () => {
    expect(await loadProfileNotification()).toHaveLength(0);
  });

  it('shows the modal with no company name', async () => {
    companyService.companyService.get.mockResolvedValue({});
    expect(await loadProfileNotification()).toHaveLength(1);
  });

  it('does not show the modal with company name', async () => {
    companyService.companyService.get.mockResolvedValue({ name: 'Company' });
    expect(await loadProfileNotification()).toHaveLength(0);
  });

  it('clicking link closes modal', async () => {
    companyService.companyService.get.mockResolvedValue({});
    const modal = (await loadProfileNotification())[0];
    await act(async () => {
      fireEvent.click(screen.getByText('Update Settings'));
    });
    await act(async () => {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 2000));
    });
    expect(modal).not.toBeVisible();
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('closing the modal hides the modal', async () => {
    companyService.companyService.get.mockResolvedValue({});
    const modal = (await loadProfileNotification())[0];
    await closeModal(modal);
  });
});
