const FileParsingStrategy = require('../lib/file-parser').FileParsingStrategy
const CsvFileProcessor = require('../lib/file-parser').CsvFileProcessor

const parse = {
  async readFile (filePath) {
    const manager = new FileParsingStrategy()
    manager.addParser(new CsvFileProcessor(), 'csv')

    try {
      const data = await manager.process(filePath)
      console.log(`${JSON.stringify(data)}`)
    } catch (err) {
      console.log(`${err}`)
    }
  }
}

module.exports = parse
