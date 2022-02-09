import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const jobService = {
  newRequestToHire,
};

function newRequestToHire(type, details, pay, location, equipment, skills) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ type, details, pay, location, equipment, skills }),
  };

  return fetch(`/api/newRequestToHire`, requestOptions).then(handleResponse);
}
