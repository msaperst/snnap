import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const userService = {
  get,
  update,
  uploadAvatar,
};

function get() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/user/get`, requestOptions).then(handleResponse);
}

function update(name, username, email) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, username, email }),
  };

  return fetch(`/api/user/update`, requestOptions).then(handleResponse);
}

function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('File', file);
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: formData,
  };
  return fetch('/api/user/set-avatar', requestOptions).then(handleResponse);
}
