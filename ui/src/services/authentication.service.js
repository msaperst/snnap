import { BehaviorSubject } from 'rxjs';

// eslint-disable-next-line import/no-cycle
import { handleResponse } from '../helpers/handle-response';

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem('currentUser'))
);

export const authenticationService = {
  register,
  forgot,
  login,
  reset,
  logout,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
};

function register(firstName, lastName, location, email, username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName,
      lastName,
      location,
      email,
      username,
      password,
    }),
  };
  const cookies = JSON.parse(localStorage.getItem('cookies'));

  return fetch(`/api/auth/register`, requestOptions)
    .then(handleResponse)
    .then(() => login(username, password, !cookies || cookies.preferences));
}

function forgot(email) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  };

  return fetch(`/api/auth/forgot`, requestOptions).then(handleResponse);
}

function login(username, password, rememberMe) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, rememberMe }),
  };

  return fetch(`/api/auth/login`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      currentUserSubject.next(user);

      return user;
    });
}

function reset(email, code, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, password }),
  };

  return fetch(`/api/auth/reset`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      login(res.username, password, true);
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
}
