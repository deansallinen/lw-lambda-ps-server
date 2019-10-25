// lambda pdf server
require('dotenv').config();
const { parse } = require('url');
const { parseQuery, getReport } = require('./_functions');

module.exports = async (req, res) => {
  try {
    const { query } = parse(req.url, true);
    const { reportID = '', elementID = '', index=0 } = query;
    const pdf = await getReport(await parseQuery({ reportID, elementID, index }));
    res.status(200).end(pdf);
  } catch (err) {
    res.end();
    throw err;
  }
};
