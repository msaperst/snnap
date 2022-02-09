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
  date,
  time,
  equipment,
  skills
) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({
      type,
      location,
      details,
      pay,
      duration,
      date,
      time,
      equipment,
      skills,
    }),
  };

  return fetch(`/api/newRequestToHire`, requestOptions).then(handleResponse);
}
