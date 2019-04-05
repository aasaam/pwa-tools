/* eslint-env jest */

const os = require('os');
const configLoader = require('../lib/configLoader');

const cwd = process.cwd();

describe('Config loader', () => {
  it('Must load with sample file', async () => {
    process.chdir(__dirname);
    const config = await configLoader();
    expect(config).toBeTruthy();
    process.chdir(cwd);
  });
  it('Must load with default', async () => {
    process.chdir(os.tmpdir());
    const config = await configLoader();
    expect(config).toBeTruthy();
    process.chdir(cwd);
  });
});
