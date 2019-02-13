// lambda pdf server
require('dotenv').config();
const { parse } = require('url');
const { parseQuery, getReport } = require('./functions');

module.exports = async (req, res) => {
  try {
    const { query } = parse(req.url, true);
    const { reportID = '', elementID = '' } = query;
    res.end(await getReport(await parseQuery({ reportID, elementID })));
  } catch (err) {
    res.end();
    throw err;
  }
};
