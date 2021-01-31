#!/usr/bin/env node
const cli = require('commander')
const parse = require('../commands/parse')

cli
  .requiredOption('-i, --in <value>', 'specify the location and name of the file to parse')
  .requiredOption('-o, --out <value>', 'specify the location and name of the file to output')
  .description('Read from a provided file and combine its information with data from the API to another file')
  .action(async () => {
    const options = cli.opts()
    if (options.in && options.out) await parse.processFile(options.in, options.out)
  })

cli.parse(process.argv)

if (!process.argv.slice(2).length) {
  cli.outputHelp()
}
