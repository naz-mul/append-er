#!/usr/bin/env node

const ConfigManager = require('../lib/config-store')

const main = async () => {
  const conf = new ConfigManager('appender')
  const [api, version] = await conf.getConfig()
  console.info(`${api} and ${version}`)
}
main().catch(err => console.error(err))
