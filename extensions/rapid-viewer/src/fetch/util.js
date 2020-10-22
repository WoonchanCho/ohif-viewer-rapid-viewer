import {
  PageNotFoundException,
  HttpException,
  CorsException,
} from '../exception';

export function getXnatUrl(xnatUrl) {
  return xnatUrl ? xnatUrl : '/xnat';
}

export async function doGet(url, disableCookie = true) {
  const options = {
    method: 'GET',
  };
  if (disableCookie) {
    options.credentials = 'omit';
  }
  const response = await doFetch(url, options);
  return response;
}

export async function doPost(url, body) {
  const response = await doFetch(url, {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify(body),
  });
  return response;
}

export async function doPut(url, body) {
  const response = await doFetch(url, {
    method: 'PUT',
    cache: 'no-cache',
    body,
  });
  return response;
}

export async function doFetch(url, options) {
  setAuthorizationHeaderForXnat(options);
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 404) {
        throw new PageNotFoundException();
      }
      let body = undefined;
      try {
        body = await response.text();
        // eslint-disable-next-line no-empty
      } finally {
      }
      throw new HttpException(response.status, response.statusText, body);
    }
    return response;
  } catch (error) {
    if (
      error instanceof HttpException ||
      error instanceof PageNotFoundException
    ) {
      throw error;
    } else {
      throw new HttpException(error.status, error.message);
    }
  }
}

function setAuthorizationHeaderForXnat(options) {
  const [token, tokenSecret] = getTokenAndSecret();
  if (token && tokenSecret) {
    const authString = `${token}:${tokenSecret}`;
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(authString));
    options.headers = headers;
  }
}

export function getBasicAuthHeader(username, password) {
  const headers = new Headers();
  const authString = `${username}:${password}`;
  headers.set('Authorization', 'Basic ' + btoa(authString));
  return headers;
}

export function getBasicAuthHeaderWithToken() {
  const [token, tokenSecret] = getTokenAndSecret();
  if (!token || !tokenSecret) {
    return undefined;
  }
  const authString = `${token}:${tokenSecret}`;
  return 'Basic ' + btoa(authString);
}

function getTokenAndSecret() {
  const user = window.store.getState().authentication.user;
  if (!user.token || !user.tokenSecret) {
    return [undefined, undefined];
  } else {
    return [user.token, user.tokenSecret];
  }
}
