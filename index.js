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
    // console.log(cookie);
    return cookie;
  } catch (err) {
    throw (err);
  }
};

const COOKIE = getFlexCookie(process.env.FLEXUSER, process.env.FLEXPASS);

const getReport = async (elementID) => {
  const reportID = '77fea750-59e5-11e7-a785-0030489e8f64'; // pull sheet
  const uri = `https://loungeworks.flexrentalsolutions.com/rest/bizops/gen-report/${reportID}?parameterSubmission=true&PROJECT_ELEMENT_ID=${elementID}&REPORT_FORMAT=pdf`;
  try {
    const response = await axios.get(uri, {
      responseType: 'arraybuffer',
      headers: {
        cookie: await COOKIE,
        'Content-Type': 'application/pdf',
      },
    });
    // console.log(response);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// const testelementID = '0e76a180-d7dd-11e8-8ad6-0030489e8f64';

module.exports = async (req, res) => {
  const { query } = parse(req.url, true);
  const { elementID = '' } = query;
  res.end(await getReport(elementID));
  //   res.end(elementID);
};
