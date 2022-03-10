import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const userService = {
  get,
  updateAccountInformation,
  updatePersonalInformation,
  uploadAvatar,
};

function get() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/user/get`, requestOptions).then(handleResponse);
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

function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: formData,
  };
  return fetch('/api/user/set-avatar', requestOptions).then(handleResponse);
}
