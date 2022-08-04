import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const jobService = {
  getJobTypes,
  getEquipment,
  getSkills,
  newRequestToHire,
  getHireRequest,
  getHireRequests,
  applyToHireRequest,
  getHireRequestApplication,
  getHireRequestApplications,
  chooseHireRequestApplication,
};

function getJobTypes() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/jobs/types`, requestOptions).then(handleResponse);
}

function getEquipment() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/jobs/equipment`, requestOptions).then(handleResponse);
}

function getSkills() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/jobs/skills`, requestOptions).then(handleResponse);
}

function newRequestToHire(
  type,
  location,
  details,
  pay,
  duration,
  durationMax,
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
      durationMax,
      date,
      time,
      equipment,
      skills,
    }),
  };

  return fetch(`/api/jobs/new-request-to-hire`, requestOptions).then(
    handleResponse
  );
}

function getHireRequest(id) {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/jobs/hire-request/${id}`, requestOptions).then(
    handleResponse
  );
}

function getHireRequests() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/jobs/hire-requests`, requestOptions).then(handleResponse);
}

function getHireRequestApplication(id) {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/jobs/hire-request-application/${id}`, requestOptions).then(
    handleResponse
  );
}

function getHireRequestApplications(id) {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(
    `/api/jobs/hire-request-applications/${id}`,
    requestOptions
  ).then(handleResponse);
}

function applyToHireRequest(
  hireRequest,
  user,
  company,
  userName,
  companyName,
  website,
  insta,
  fb,
  experience,
  equipment,
  skills,
  portfolio
) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      hireRequest,
      user,
      company,
      userName,
      companyName,
      website,
      fb,
      insta,
      experience,
      equipment,
      skills,
      portfolio,
    }),
  };

  return fetch(`/api/jobs/apply-to-hire-request`, requestOptions).then(
    handleResponse
  );
}

function chooseHireRequestApplication(hireRequest, hireRequestApplication) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      hireRequest,
      hireRequestApplication,
    }),
  };

  return fetch(
    `/api/jobs/select-hire-request-application`,
    requestOptions
  ).then(handleResponse);
}
