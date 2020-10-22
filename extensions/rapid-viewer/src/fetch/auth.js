import { BadCredentialException, HttpException } from '../exception';
import { getXnatUrl, doGet, doPut, getBasicAuthHeader } from './util';

const MIN_KEY_LEN = 32;
const MAX_KEY_LEN = 64;

export async function fetchLogin(xnatUrl, username, password) {
  const url = `${getXnatUrl(xnatUrl)}/data/services/auth`;
  const body = `username=${username}&password=${password}`;

  try {
    const response = await doPut(url, body);
    const sessionId = await response.text();
    validateSessionId(sessionId);

    return sessionId;
  } catch (error) {
    if (
      error instanceof HttpException &&
      error.body &&
      error.body.indexOf('Bad credentials') >= 0
    ) {
      throw new BadCredentialException();
    } else {
      throw error;
    }
  }
}

export async function fetchTokenIssue(xnatUrl, username, password) {
  const url = `${getXnatUrl(xnatUrl)}/data/services/tokens/issue`;
  // const response = await doGet(url);
  const headers = getBasicAuthHeader(username, password);
  const response = await fetch(url, { headers, credentials: 'omit' });
  return await response.json();
}

export async function fetchTokenInvalidate(xnatUrl, token, secret) {
  const url = `${
    xnatUrl ? xnatUrl : '/xnat'
  }/data/services/tokens/invalidate/${token}/${secret}`;
  await doGet(url);
}

function validateSessionId(sessionId) {
  if (sessionId.length < MIN_KEY_LEN) {
    throw new Error('Invalid session id coming');
  }
  if (sessionId.length > MAX_KEY_LEN) {
    throw new Error('Unknown error happened');
  }
}
