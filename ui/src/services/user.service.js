import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const userService = {
  get,
  getHireRequests,
  getHireRequestApplications,
  updateAccountInformation,
  updatePersonalInformation,
  uploadAvatar,
  updatePassword,
};

function get(id) {
  let url = `/api/user/get`;
  if (id) {
    url += `/${id}`;
  }
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(url, requestOptions).then(handleResponse);
}

function getHireRequests() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/user/hire-requests`, requestOptions).then(handleResponse);
}

function getHireRequestApplications() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/user/hire-request-applications`, requestOptions).then(
    handleResponse
  );
}

function updateAccountInformation(email, number) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, number }),
  };

  return fetch(`/api/user/update-account-information`, requestOptions).then(
    handleResponse
  );
}

function updatePersonalInformation(firstName, lastName, city, state, zip) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({ firstName, lastName, city, state, zip }),
  };

  return fetch(`/api/user/update-personal-information`, requestOptions).then(
    handleResponse
  );
}

async function uploadAvatar(avatar) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({ avatar }),
  };
  return fetch('/api/user/set-avatar', requestOptions).then(handleResponse);
}

async function updatePassword(currentPassword, newPassword) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({ currentPassword, newPassword }),
  };

  return fetch(`/api/user/update-password`, requestOptions).then(
    handleResponse
  );
}
