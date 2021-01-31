#!/usr/bin/env node
const cli = require('commander')
const pkg = require('../package.json')

cli
  .version(pkg.version, '-v, --version', 'output the version number')
  .command('config', 'configure environment')
  .command('parse', 'parse a file for processing')
  .parse(process.argv)
