import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const userService = {
  get,
};

function get() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/get-user`, requestOptions).then(handleResponse);
}
