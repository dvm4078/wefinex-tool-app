// import fetch from 'isomorphic-unfetch';
import Authendication from './authendication';

function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

// export default function request(url, options) {
//   return fetch(url, options).then(checkStatus).then(parseJSON);
// }
export default function request(url, options) {
  // const url = `${API_ENDPOIN}${path}`;
  return fetch(url, {
    headers: {
      authorization: Authendication.getToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...options,
  })
    .then(checkStatus)
    .then(parseJSON);
}
