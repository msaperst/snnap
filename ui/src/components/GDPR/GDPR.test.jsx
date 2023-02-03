import React from 'react';
import '@testing-library/jest-dom';
import { useLocation } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import GDPR from './GDPR';

jest.mock('../../services/authentication.service');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: jest.fn(),
  // eslint-disable-next-line jsx-a11y/anchor-has-content,react/destructuring-assignment
  Link: (props) => <a {...props} href={props.to} />,
}));

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

describe('gdpr', () => {
  let showGDPR;
  const setShowGDPR = (show) => {
    showGDPR = show;
  };

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: fakeLocalStorage,
    });
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    showGDPR = false;
    useLocation.mockImplementation(() => jest.fn());
    localStorage.clear();
  });

  it('shows nothing if cookies are set', async () => {
    const cookies = {};
    cookies.necessary = true;
    cookies.preferences = true;
    cookies.analytics = true;
    localStorage.setItem('cookies', JSON.stringify(cookies));
    const modal = await renderGDPR(showGDPR);
    expect(showGDPR).toBeFalsy();
    expect(modal).toHaveLength(0);
  });

  it('shows modal if cookies are not set', async () => {
    const modal = (await renderGDPR(showGDPR))[0];
    expect(showGDPR).toBeTruthy();
    // TODO - still can't find the gdpr modal
    // expect(modal).toHaveLength(1);
  });

  it('shows modal if passed in to show it', async () => {
    const cookies = {};
    cookies.necessary = true;
    cookies.preferences = true;
    cookies.analytics = true;
    localStorage.setItem('cookies', JSON.stringify(cookies));
    showGDPR = true;
    const modal = await renderGDPR(showGDPR);
    expect(showGDPR).toBeTruthy();
    expect(modal).toHaveLength(1);
  });

  // expects in method
  // eslint-disable-next-line jest/expect-expect
  it('closing the modal hides the modal', async () => {
    showGDPR = true;
    const modal = (await renderGDPR(showGDPR))[0];
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(showGDPR).toBeFalsy();
    // TODO - still can't properly hide the gdpr modal
    // expect(modal).not.toBeVisible();
  });

  it('shows the correct modal header', async () => {
    showGDPR = true;
    const modal = (await renderGDPR(showGDPR))[0];
    expect(modal.firstChild.children).toHaveLength(3);
    expect(modal.firstChild.firstChild).toHaveTextContent(
      'Cookies & Privacy Policy'
    );
  });

  it('shows the correct modal footer', async () => {
    showGDPR = true;
    const modal = (await renderGDPR(showGDPR))[0];
    expect(modal.firstChild.lastChild.children).toHaveLength(2);
    expect(modal.firstChild.lastChild.firstChild).toHaveTextContent(
      'Customize'
    );
    expect(modal.firstChild.lastChild.lastChild).toHaveTextContent('Accept');
  });

  it('clicking accept closes the modal and sets all preferences', async () => {
    showGDPR = true;
    const modal = (await renderGDPR(showGDPR))[0];
    fireEvent.click(screen.getAllByRole('button')[2]);
    expect(showGDPR).toBeFalsy();
    // TODO - still can't properly hide the gdpr modal
    // expect(modal).not.toBeVisible();
    expect(localStorage.getItem('cookies')).toEqual(
      JSON.stringify({
        necessary: true,
        preferences: true,
        analytics: true,
      })
    );
  });

  it('clicking customize shows the preference', async () => {
    showGDPR = true;
    await renderGDPR(showGDPR);
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button')[1]);
    });
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0].getAttribute('id')).toEqual('necessaryCookies');
    expect(checkboxes[1].getAttribute('id')).toEqual('sitePreferencesCookies');
    expect(checkboxes[2].getAttribute('id')).toEqual('analyticsCookies');
    expect(checkboxes[0].getAttribute('disabled')).toEqual('');
    expect(checkboxes[1].getAttribute('disabled')).toBeNull();
    expect(checkboxes[2].getAttribute('disabled')).toBeNull();
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it('customized preferences show previously saved preferences', async () => {
    const cookies = {};
    cookies.necessary = true;
    cookies.preferences = true;
    cookies.analytics = true;
    localStorage.setItem('cookies', JSON.stringify(cookies));
    showGDPR = true;
    await renderGDPR(showGDPR);
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button')[1]);
    });
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it('clicking customize then accept sets only needed preferences', async () => {
    showGDPR = true;
    await renderGDPR(showGDPR);
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button')[1]);
    });
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button')[2]);
    });
    expect(localStorage.getItem('cookies')).toEqual(
      JSON.stringify({
        necessary: true,
        preferences: false,
        analytics: false,
      })
    );
  });

  it('allows updating off preferences', async () => {
    const cookies = {};
    cookies.necessary = true;
    cookies.preferences = true;
    cookies.analytics = true;
    localStorage.setItem('cookies', JSON.stringify(cookies));
    showGDPR = true;
    await renderGDPR(showGDPR);
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button')[1]);
    });
    const checkboxes = screen.getAllByRole('checkbox');
    await act(async () => {
      fireEvent.click(checkboxes[1]);
    });
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button')[2]);
    });
    expect(localStorage.getItem('cookies')).toEqual(
      JSON.stringify({
        necessary: true,
        preferences: false,
        analytics: true,
      })
    );
  });

  it('hids the gdpr modal when going to privacy policy', async () => {
    showGDPR = true;
    const modal = (await renderGDPR(showGDPR))[0];
    fireEvent.click(screen.getAllByRole('link')[0]);
    expect(showGDPR).toBeFalsy();
    // TODO - still can't properly hide the gdpr modal
    // expect(modal).not.toBeVisible();
  });

  async function renderGDPR(show = true) {
    await act(async () => {
      const { container } = render(
        <GDPR showGDPR={show} setShowGDPR={setShowGDPR} />
      );
      await waitFor(() => container.firstChild);
    });
    return waitFor(() => screen.queryAllByTestId('gdpr'));
  }
});
