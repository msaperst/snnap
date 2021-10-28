import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const userService = {
  getAll
};

function getAll() {
  const requestOptions = { method: 'POST', headers: authHeader() };
  return fetch(`/api/get-user`, requestOptions).then(handleResponse);
}