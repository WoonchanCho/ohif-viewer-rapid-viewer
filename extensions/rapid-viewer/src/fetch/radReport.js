import { getXnatUrl, doPost } from './util';

export async function fetchRadReportForm(reportId) {
  const url = `https://phpapi.rsna.org/radreport/v1/templates/${reportId}/details`;
  const response = await fetch(url, { method: 'GET' });

  const json = await response.json();
  return json.DATA;
}

export async function postRadReportForm(
  xnatUrl,
  workGroupId,
  workItemId,
  reportId,
  json
) {
  const url = `${getXnatUrl(
    xnatUrl
  )}/xapi/workGroups/${workGroupId}/items/${workItemId}/report`;
  const response = await doPost(url, {
    reportId,
    json,
  });
  return await response.json();
}
