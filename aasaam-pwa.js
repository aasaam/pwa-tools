#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const prettyjson = require('prettyjson');
const ora = require('ora');

const packageJson = require('./package.json');
const configLoader = require('./lib/configLoader');
const generateIcons = require('./lib/generateIcons');

const { log } = console;

program.version(packageJson.version);

program.command('generate-icons').action(async () => {
  const spinner = ora('Generating icons...').start();
  const config = await configLoader();
  const [e, text] = await generateIcons(config);
  if (e) {
    spinner.fail(text);
  } else {
    spinner.succeed(text);
  }
});

program.command('show-config').action(async () => {
  const config = await configLoader();
  log(prettyjson.render(config));
});

program.command('init').action(async () => {
  const config = await configLoader();
  const p = path.join(process.cwd(), '.aasaam');
  await new Promise((r) => {
    fs.writeFile(p, JSON.stringify(config, null, 2), () => {
      r();
    });
  });
});

program.parse(process.argv);
