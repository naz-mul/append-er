const ConfigManager = require('../lib/config-manager')
const pkg = require('../package.json')
const FileParsingStrategy = require('../lib/file-parser').FileParsingStrategy
const CsvFileProcessor = require('../lib/file-parser').CsvFileProcessor
const RestApi = require('../lib/rest-api')
const outputData = []

const parse = {
  async processFile (inputFile, outputFile) {
    const manager = new FileParsingStrategy()
    manager.addParser(new CsvFileProcessor(), 'csv')
    // TODO remove = from inputFile
    try {
      const data = await manager.read(inputFile)
      console.info('File successfully read')
      const api = new RestApi(await this.getConfig())
      for (let i = 0; i < Array.from(data).length; i++) {
        if (data[i].accountId.trim().length > 0) {
          console.log(data[i].accountId)
          const response = await api.getAccount(data[i].accountId)
          const account = response.data
          outputData.push({
            'Account ID': account.account_id,
            'First Name': data[i].firstName,
            'Created On': data[i].createdOn,
            Status: account.status,
            'Status Set On': account.created_on
          })
        }
      }
      if (outputData.length > 0) {
        console.log(`${JSON.stringify(outputData)}`)
        await manager.write(outputData, outputFile)
      }
    } catch (err) {
      console.error(`${err}`)
    }
  },
  async getConfig () {
    const manager = new ConfigManager(pkg.name)
    try {
      const [env, baseUri] = await manager.getEnvironmentConfig()
      if (baseUri !== 'http://interview.wpengine.io/v1') throw new Error('Invalid base url')
      return [env, baseUri]
    } catch {
      console.debug('No valid config found, defaulting to Development config')
      return ['Development', 'http://interview.wpengine.io/v1']
    }
  }
}

module.exports = parse
