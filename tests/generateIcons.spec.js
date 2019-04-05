/* eslint-env jest */

const os = require('os');
const configLoader = require('../lib/configLoader');
const generateIcons = require('../lib/generateIcons');

const cwd = process.cwd();

jest.setTimeout(300000);

describe('Generate icons', () => {
  it('Must get an error', async () => {
    process.chdir(os.tmpdir());
    const config = await configLoader();
    const [e] = await generateIcons(config);
    expect(e).toBeTruthy();
    process.chdir(cwd);
  });
  it('Must success', async () => {
    process.chdir(__dirname);
    const config = await configLoader();
    const [e] = await generateIcons(config);
    expect(e).toEqual(null);
    process.chdir(cwd);
  });
});
