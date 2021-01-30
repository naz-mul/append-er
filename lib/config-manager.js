const Configstore = require('configstore')

class ConfigManager {
  constructor (name) {
    this.conf = new Configstore(name)
  }

  async getEnvironmentConfig () {
    const env = this.conf.get('env')
    const baseUri = this.conf.get('baseUri')
    if (env && baseUri) {
      return [env, baseUri]
    }
    throw new Error('No environment config found')
  }

  async saveEnvironmentConfig (env, baseUri) {
    this.conf.set('env', env)
    this.conf.set('baseUri', baseUri)
  }

  async deleteEnvironmentConfig (env, baseUri) {
    this.conf.delete('env', env)
    this.conf.delete('baseUri', baseUri)
  }
}

module.exports = ConfigManager
