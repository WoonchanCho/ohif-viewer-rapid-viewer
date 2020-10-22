import { getXnatUrl, doGet, doFetch } from './util';

export async function fetchPluginCheck(user) {
  const { xnatUrl, token, tokenSecret } = user;
  const url = `${getXnatUrl(xnatUrl)}/xapi/workLists/check`;
  const headers = new Headers();
  const authString = `${token}:${tokenSecret}`;
  headers.set('Authorization', 'Basic ' + btoa(authString));
  await doFetch(url, { headers: headers });
}

export async function fetchWorkLists(xnatUrl) {
  const url = `${getXnatUrl(xnatUrl)}/xapi/workLists`;
  const response = await doGet(url);
  return await response.json();
}

export async function fetchWorkList(xnatUrl, workListId) {
  const url = `${getXnatUrl(xnatUrl)}/xapi/workLists/${workListId}`;
  const response = await doGet(url);
  return await response.json();
}

export async function fetchWorkItems(xnatUrl, workListId) {
  const url = `${getXnatUrl(xnatUrl)}/xapi/workLists/${workListId}/items`;
  const response = await doGet(url);
  return await response.json();
}

export async function fetchMetadata(xnatUrl, projectId, experimentId) {
  const url = `${getXnatUrl(
    xnatUrl
  )}/xapi/viewer/projects/${projectId}/experiments/${experimentId}`;
  const response = await doGet(url);
  return await response.json();
}
