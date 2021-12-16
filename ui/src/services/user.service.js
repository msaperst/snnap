import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const userService = {
  getUser,
};

function getUser() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/get-user`, requestOptions).then(handleResponse);
}
