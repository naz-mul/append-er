const CsvFileFormatter = require('./csv-formatter')
const fileReadHeaders = ['accountId', 'accountName', 'firstName', 'createdOn']
const fileWriteHeaders = ['Account ID', 'First Name', 'Created On', 'Status', 'Status Set On']

class FileParsingStrategy {
  constructor () {
    this._parsers = new Map()
  }

  addParser (parser, fileType) {
    this._parsers.set(fileType, parser)
  }

  getParser (name) {
    if (!this._parsers.has(name)) throw new Error('No file parser found')
    return this._parsers.get(name)
  }

  getValidProcessor (filePath) {
    const lastIndexOf = filePath.lastIndexOf('.')
    return this.getParser(filePath.substring(lastIndexOf + 1))
  }

  async read (filePath) {
    if (filePath.endsWith('.csv')) {
      const processor = this.getValidProcessor(filePath)
      if (processor instanceof CsvFileProcessor) return await processor.read(filePath)
    }
    throw new Error('File type is not supported')
  }

  async write (data, filePath) {
    if (filePath.endsWith('.csv')) {
      const processor = this.getValidProcessor(filePath)
      if (processor instanceof CsvFileProcessor) return await processor.write(data, filePath)
    }
    throw new Error('File type is not supported')
  }
}

class CsvFileProcessor {
  async read (filePath) {
    const csv = new CsvFileFormatter({
      path: filePath,
      headers: fileReadHeaders
    })
    return await csv.read()
  }

  async write (data, filePath) {
    const csv = new CsvFileFormatter({
      path: filePath,
      headers: fileWriteHeaders
    })
    return await csv.create(data)
  }
}

module.exports = { FileParsingStrategy, CsvFileProcessor }
