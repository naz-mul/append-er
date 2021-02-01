const ConfigManager = require('../lib/config-manager')
const pkg = require('../package.json')
const FileParsingStrategy = require('../lib/file-parser').FileParsingStrategy
const CsvFileProcessor = require('../lib/file-parser').CsvFileProcessor
const RestApi = require('../lib/rest-api')
const outputData = []

const parse = {
  async processFile (inputFile, outputFile) {
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser(new CsvFileProcessor(), 'csv')
    // TODO remove = from inputFile
    try {
      const data = await parsingStrategy.read(inputFile)
      console.info('File successfully read')
      const api = new RestApi(await this.getConfig())
      for (let i = 0; i < Array.from(data).length; i++) {
        if (data[i].accountId.trim().length > 0) {
          const response = await api.getAccount(data[i].accountId)
          outputData.push({
            'Account ID': response.data.account_id,
            'First Name': data[i].firstName,
            'Created On': data[i].createdOn,
            Status: response.data.status,
            'Status Set On': response.data.created_on
          })
        }
      }
      if (outputData.length > 0) {
        await parsingStrategy.write(outputData, outputFile)
        console.info('File successfully written')
        return
      }
      console.info('Nothing to write')
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
