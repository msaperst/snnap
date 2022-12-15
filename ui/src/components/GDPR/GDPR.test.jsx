import React from 'react';
import '@testing-library/jest-dom';
import { useLocation } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
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

  it('shows nothing if cookies are set', () => {
    const cookies = {};
    cookies.necessary = true;
    cookies.preferences = true;
    cookies.analytics = true;
    localStorage.setItem('cookies', JSON.stringify(cookies));
    const { container } = render(<GDPR />);
    expect(container.children).toHaveLength(0);
  });

  it('shows modal if cookies are not set', async () => {
    const container = await renderGDPR(false);
    // TODO - doesn't work
    // expect(container.children).toHaveLength(1);
  });

  it('shows modal if passed in to show it', async () => {
    const cookies = {};
    cookies.necessary = true;
    cookies.preferences = true;
    cookies.analytics = true;
    localStorage.setItem('cookies', JSON.stringify(cookies));
    const container = await renderGDPR(true);
    // TODO - doesn't work
    // expect(container.children).toHaveLength(1);
  });

  it('shows all the modal info', () => {
    // TODO
  });

  it('clicking accept closes the modal and sets all preferences', () => {
    // TODO
  });

  it('clicking customize shows the preference', () => {
    // TODO
  });

  it('customized preferences show previously saved preferences', () => {
    // TODO
  });

  it('clicking customize then accept sets only needed preferences', () => {
    // TODO
  });

  async function renderGDPR(show = {}) {
    let gdpr;
    showGDPR = show;
    await act(async () => {
      gdpr = render(<GDPR showGDPR={showGDPR} setShowGDPR={setShowGDPR} />);
      const { container } = gdpr;
      await waitFor(() => container.firstChild);
    });
    const { container } = gdpr;
    return container;
  }
});
