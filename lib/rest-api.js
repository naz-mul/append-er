const axios = require('axios')

class RestApi {
  constructor (config) {
    this._config = config
    this._instance = axios.create({
      baseURL: this._config[1],
      timeout: 5000
    })
  }

  async getAccount (accountId) {
    return await this._instance.get(`/accounts/${accountId}`)
  }
}

module.exports = RestApi
