#!/usr/bin/env node
const cli = require('commander')
const pkg = require('../package.json')
const conf = require('../commands/config')

cli
  .option('-i, --init', 'initialise configuration')
  .option('-r, --reset', 'reset configuration')
  .description('Initialize environment config or reset previously set configuration')
  .action(async () => {
    const options = cli.opts()
    if (options.init) await conf.env(pkg.name)
    if (options.reset) await conf.reset(pkg.name)
  })

cli.parse(process.argv)

if (!process.argv.slice(2).length) {
  cli.outputHelp()
}
