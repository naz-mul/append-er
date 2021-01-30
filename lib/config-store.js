const Configstore = require('configstore')
const inquirer = require('inquirer')

class ConfigManager {
  constructor (name) {
    this.conf = new Configstore(name)
  }

  async getConfig () {
    const env = this.conf.get('env')
    if (env) {
      const baseUri = this.conf.get('baseUri')
      return [env, baseUri]
    } else {
      const answers = await inquirer.prompt([
        { type: 'list', name: 'env', choices: ['Development', 'Production'], message: 'Select your environment' },
        { type: 'list', name: 'baseUri', choices: ['http://interview.wpengine.io/v1', 'http://interview.wpengine.io/v1'], message: 'Select the base url of your API' }
      ])
      this.conf.set('env', answers.env)
      this.conf.set('baseUri', answers.baseUri)
      return [answers.env, answers.baseUri]
    }
  }
}

module.exports = ConfigManager
