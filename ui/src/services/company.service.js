import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const companyService = {
  get,
  updatePortfolio,
  updateCompanyInformation,
};

function get(id) {
  let url = `/api/company/get`;
  if (id) {
    url += `/${id}`;
  }
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(url, requestOptions).then(handleResponse);
}

function updatePortfolio(experience, portfolioItems) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({ experience, portfolioItems }),
  };

  return fetch(`/api/company/update-portfolio`, requestOptions).then(
    handleResponse
  );
}

function updateCompanyInformation(name, website, insta, fb, equipment, skills) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, website, insta, fb, equipment, skills }),
  };

  return fetch(`/api/company/update-company-information`, requestOptions).then(
    handleResponse
  );
}
