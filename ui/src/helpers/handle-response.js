// eslint-disable-next-line import/no-cycle
import { authenticationService } from '../services/authentication.service';

export function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    // if a json response
    return response.json().then((data) => {
      if (!response.ok) {
        if ([401, 403].indexOf(response.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          authenticationService.logout();
          // location.reload()
        }
        return Promise.reject(data.msg);
      }
      return data;
    });
  }
  // otherwise must be an error
  return response.text().then((text) => {
    Promise.reject(text);
  });
}
