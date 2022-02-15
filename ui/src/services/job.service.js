import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const jobService = {
  newRequestToHire,
};

function newRequestToHire(
  type,
  location,
  details,
  pay,
  duration,
  units,
  date,
  time,
  equipment,
  skills
) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type,
      location,
      details,
      pay,
      duration,
      units,
      date,
      time,
      equipment,
      skills,
    }),
  };

  return fetch(`/api/newRequestToHire`, requestOptions).then(handleResponse);
}
