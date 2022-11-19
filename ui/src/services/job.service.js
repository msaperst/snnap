import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const jobService = {
  getJobTypes,
  getJobSubtypes,
  getEquipment,
  getSkills,
  newJob,
  getJob,
  applyToJob,
  getJobApplication,
  getJobApplications,
  chooseJobApplication,
};

function getJobTypes() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/jobs/types`, requestOptions).then(handleResponse);
}

function getJobSubtypes() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/jobs/subtypes`, requestOptions).then(handleResponse);
}

function getEquipment() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/jobs/equipment`, requestOptions).then(handleResponse);
}

function getSkills() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/jobs/skills`, requestOptions).then(handleResponse);
}

function newJob(
  type,
  subtype,
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
      subtype,
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

  return fetch(`/api/jobs/new-job`, requestOptions).then(handleResponse);
}

function getJob(id) {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/jobs/job/${parseInt(id, 10)}`, requestOptions).then(
    handleResponse
  );
}

function getJobApplication(id) {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(
    `/api/jobs/job-application/${parseInt(id, 10)}`,
    requestOptions
  ).then(handleResponse);
}

function getJobApplications(id) {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(
    `/api/jobs/job-applications/${parseInt(id, 10)}`,
    requestOptions
  ).then(handleResponse);
}

function applyToJob(
  job,
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
  comment,
  portfolio
) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      job,
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
      comment,
      portfolio,
    }),
  };

  return fetch(`/api/jobs/apply-to-job`, requestOptions).then(handleResponse);
}

function chooseJobApplication(job, jobApplication) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      job,
      jobApplication,
    }),
  };

  return fetch(`/api/jobs/select-job-application`, requestOptions).then(
    handleResponse
  );
}
