import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const userService = {
  getUser,
  updateProfile,
  uploadAvatar,
};

function getUser() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/get-user`, requestOptions).then(handleResponse);
}

function updateProfile(name, username, email) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, username, email }),
  };

  return fetch(`/api/updateProfile`, requestOptions).then(handleResponse);
}

function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('File', file);
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: formData,
  };
  return fetch('/api/set-avatar', requestOptions).then(handleResponse);
}
