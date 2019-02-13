// functions.js
require('dotenv').config();
const axios = require('axios');

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
    throw err;
  }
};

const COOKIE = getFlexCookie(process.env.FLEXUSER, process.env.FLEXPASS);

const getReport = async ({ reportID, elementID }) => {
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
    throw err;
  }
};

const parseQuery = async ({ reportID, elementID }) => {
  const quoteDefinitionID = '9bfb850c-b117-11df-b8d5-00e08175e43e';
  const pullSheetDefinitionID = 'a220432c-af33-11df-b8d5-00e08175e43e';
  //   const quoteReportID = '3bb30290-5830-11e5-8638-003048de147e';
  const pullSheetReportID = '77fea750-59e5-11e7-a785-0030489e8f64';
  try {
    const { definitionId, childIds } = await getFlexDetails(elementID);
    const pullSheetPromise = Promise.all(
      childIds
        .map(async childID => getFlexDetails(childID))
        .filter(async child => child.definitionId === pullSheetDefinitionID),
    );
    const [pullSheet] = await pullSheetPromise;
    if (definitionId === quoteDefinitionID && pullSheet) {
      return { reportID: pullSheetReportID, elementID: pullSheet.objectIdentifier };
    }
    return { reportID, elementID };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getFlexCookie,
  getFlexDetails,
  getReport,
  parseQuery,
};
