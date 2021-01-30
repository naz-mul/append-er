const ConfigManager = require('../lib/config-manager')
const inquirer = require('inquirer')

const config = {
  async env (name) {
    const conf = new ConfigManager(name)
    try {
      const [env, baseUri] = await conf.getEnvironmentConfig()
      if (env && baseUri) {
        console.error('Environment config already exists')
        process.exit(1)
      }
    } catch {
      const choices = await inquirer.prompt([
        {
          type: 'list',
          name: 'env',
          choices: ['Development', 'Production'],
          message: 'Select your environment'
        },
        {
          type: 'list',
          name: 'baseUri',
          choices: ['http://interview.wpengine.io/v1',
            'http://interview.wpengine.io/v1'],
          message: 'Select the base url for your API'
        }
      ])
      // TODO set baseUri automatically based on the environment selected
      await conf.saveEnvironmentConfig(choices.env, choices.baseUri)
    }
  },
  async reset (name) {
    const conf = new ConfigManager(name)
    try {
      const [env, baseUri] = await conf.getEnvironmentConfig()
      if (env && baseUri) {
        await conf.deleteEnvironmentConfig(env, baseUri)
      }
    } catch {
      console.info('No configurations found')
    }
  }
}

module.exports = config
