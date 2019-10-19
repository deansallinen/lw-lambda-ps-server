// lambda pdf server
require('dotenv').config();
const { parse } = require('url');
const { parseQuery, getReport } = require('./functions');

module.exports = async (req, res) => {
  try {
    const { query } = parse(req.url, true);
    const { reportID = '', elementID = '' } = query;
    const pdf = await getReport(await parseQuery({ reportID, elementID }));
    res.end(pdf);
  } catch (err) {
    res.end();
    throw err;
  }
};
