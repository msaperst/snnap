import '@testing-library/jest-dom';
import ReactGA from 'react-ga4';
import { commonFormComponents } from './CommonFormComponents';

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

describe('common form components', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: fakeLocalStorage,
    });
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    localStorage.clear();
  });

  it('calls pageview with homepage', () => {
    const spy = jest.spyOn(ReactGA, 'send');
    commonFormComponents.setPageView('/');
    expect(spy).toHaveBeenCalledWith({
      hitType: 'pageview',
      page: '/',
      title: 'Homepage',
    });
  });

  it('calls pageview properly with a basic page', () => {
    const spy = jest.spyOn(ReactGA, 'send');
    commonFormComponents.setPageView('/chat');
    expect(spy).toHaveBeenCalledWith({
      hitType: 'pageview',
      page: '/chat',
      title: 'Chat',
    });
  });

  it('calls pageview properly with a complex page', () => {
    const spy = jest.spyOn(ReactGA, 'send');
    commonFormComponents.setPageView('/chat/msaperst');
    expect(spy).toHaveBeenCalledWith({
      hitType: 'pageview',
      page: '/chat/msaperst',
      title: 'Chat Msaperst',
    });
  });

  it('does not call pageview if cookies are set without analytics', () => {
    const cookies = {};
    cookies.necessary = true;
    cookies.preferences = true;
    cookies.analytics = false;
    localStorage.setItem('cookies', JSON.stringify(cookies));
    const spy = jest.spyOn(ReactGA, 'send');
    commonFormComponents.setPageView('/');
    expect(spy).not.toHaveBeenCalled();
  });

  it('calls pageview if cookies are set with analytics', () => {
    const cookies = {};
    cookies.necessary = true;
    cookies.preferences = true;
    cookies.analytics = true;
    localStorage.setItem('cookies', JSON.stringify(cookies));
    const spy = jest.spyOn(ReactGA, 'send');
    commonFormComponents.setPageView('/');
    expect(spy).toHaveBeenCalled();
  });

  it('calls event properly with category and action', () => {
    const spy = jest.spyOn(ReactGA, 'event');
    commonFormComponents.setEvent('category', 'action');
    expect(spy).toHaveBeenCalledWith({
      action: 'action',
      category: 'category',
    });
  });

  it('does not call event if cookies are set without analytics', () => {
    const cookies = {};
    cookies.necessary = true;
    cookies.preferences = true;
    cookies.analytics = false;
    localStorage.setItem('cookies', JSON.stringify(cookies));
    const spy = jest.spyOn(ReactGA, 'event');
    commonFormComponents.setEvent('category', 'event');
    expect(spy).not.toHaveBeenCalled();
  });

  it('calls event if cookies are set with analytics', () => {
    const cookies = {};
    cookies.necessary = true;
    cookies.preferences = true;
    cookies.analytics = true;
    localStorage.setItem('cookies', JSON.stringify(cookies));
    const spy = jest.spyOn(ReactGA, 'event');
    commonFormComponents.setEvent('category', 'event');
    expect(spy).toHaveBeenCalled();
  });
});
