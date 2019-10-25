/**
 * @jest-environment node
 */

const { parseQuery } = require('./api/_functions');

test('should return one pull sheet id given a quote id', async () => {
  const query = {
    elementID: '258b6270-120c-11e9-9163-4676808eeebb',
    reportID: '258b6270-120c-11e9-9163-4676808eeebb',
  };
  const res = await parseQuery(query);
  expect(res).toHaveProperty('elementID', '49228f00-2f0e-11e9-9163-4676808eeebb');
});

test('should return one pull sheet id given a pull sheet id', async () => {
  const query = {
    elementID: '49228f00-2f0e-11e9-9163-4676808eeebb',
    reportID: '258b6270-120c-11e9-9163-4676808eeebb',
  };
  const res = await parseQuery(query);
  expect(res).toHaveProperty('elementID', '49228f00-2f0e-11e9-9163-4676808eeebb');
});

test('should return quote id if no pull sheet on quote', async () => {
  const query = {
    elementID: 'ab398640-de4e-11e9-aea5-4676808eeebb', // NOTE: update each time
    reportID: '258b6270-120c-11e9-9163-4676808eeebb',
  };
  const res = await parseQuery(query);
  expect(res).toHaveProperty('elementID', 'ab398640-de4e-11e9-aea5-4676808eeebb');
});

test('should return different pull sheet ids given a different index', async () => {
  const query = {
    elementID: 'e5179770-ec78-11e9-aea5-4676808eeebb',
    reportID: '258b6270-120c-11e9-9163-4676808eeebb',
  };
  const res1 = await parseQuery({ ...query, index: 0 });
  const res2 = await parseQuery({ ...query, index: 1 });
  expect(res1.elementID).not.toBe(res2.elementID);
});