import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const jobService = {
  getJobTypes,
  getEquipment,
  getSkills,
  newRequestToHire,
  getHireRequests,
};

function getJobTypes() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/job-types`, requestOptions).then(handleResponse);
}
function getEquipment() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/equipment`, requestOptions).then(handleResponse);
}
function getSkills() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/skills`, requestOptions).then(handleResponse);
}

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

  return fetch(`/api/new-request-to-hire`, requestOptions).then(handleResponse);
}

function getHireRequests() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/hire-requests`, requestOptions).then(handleResponse);
}
