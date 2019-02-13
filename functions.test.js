/**
 * @jest-environment node
 */

const { parseQuery } = require('./functions');

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
    elementID: 'b12d2810-2006-11e9-9163-4676808eeebb',
    reportID: '258b6270-120c-11e9-9163-4676808eeebb',
  };
  const res = await parseQuery(query);
  expect(res).toHaveProperty('elementID', 'b12d2810-2006-11e9-9163-4676808eeebb');
});
