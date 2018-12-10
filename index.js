// lambda pdf server
const { parse } = require('url');
const axios = require('axios');
require('dotenv').config();

const getFlexCookie = async (user, pass) => {
  const AUTH_URL = 'https://loungeworks.flexrentalsolutions.com/rest/core/authenticate';
  try {
    const response = await axios({
      url: AUTH_URL,
      method: 'post',
      params: {
        username: user,
        password: pass,
      },
    });
    const cookie = await response.headers['set-cookie'];
    return cookie;
  } catch (err) {
    throw (err);
  }
};

const COOKIE = getFlexCookie(process.env.FLEXUSER, process.env.FLEXPASS);

const getReport = async (reportID, elementID) => {
  const uri = `https://loungeworks.flexrentalsolutions.com/rest/bizops/gen-report/${reportID}?parameterSubmission=true&PROJECT_ELEMENT_ID=${elementID}&REPORT_FORMAT=pdf`;
  try {
    const response = await axios.get(uri, {
      responseType: 'arraybuffer',
      headers: {
        cookie: await COOKIE,
        'Content-Type': 'application/pdf',
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

const getFlexDetails = async (eventId) => {
  const URL = `https://loungeworks.flexrentalsolutions.com/rest/elements/get?id=${eventId}`;
  try {
    const res = await axios.get(URL, {
      headers: { cookie: await COOKIE },
    });
    return res.data;
  } catch (err) {
    throw (err);
  }
};

const quoteDefinitionID = '9bfb850c-b117-11df-b8d5-00e08175e43e';
const pullSheetDefinitionID = 'a220432c-af33-11df-b8d5-00e08175e43e';

const parseQuery = async (query) => {
  const { elementID, reportID } = query;
  const { childIds, definitionId } = await getFlexDetails(elementID);
  if (definitionId === quoteDefinitionID) {
    const [pullSheet] = childIds
      .map(async childID => getFlexDetails(childID))
      .filter(async child => child.definitionId === pullSheetDefinitionID);
    const { objectIdentifier } = await pullSheet;
    return { reportID, elementID: objectIdentifier };
  }
  return query;
};

module.exports = async (req, res) => {
  const { query } = parse(req.url, true);
  const { reportID = '', elementID = '' } = parseQuery(query);
  res.end(await getReport(reportID, elementID));
};
