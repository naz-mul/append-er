const csv = require('neat-csv')
const fs = require('fs')
const headers = ['account_id', 'account_name', 'first_name', 'created_on']

class FileParsingStrategy {
  constructor () {
    this._parsers = new Map()
  }

  addParser (parser, fileType) {
    this._parsers.set(fileType, parser)
  }

  getParser (name) {
    if (this._parsers.size < 0 && !this._parsers.has(name)) throw new Error('No file parser found')
    return this._parsers.get(name)
  }

  async process (filePath) {
    if (filePath.endsWith('.csv')) {
      const lastIndexOf = filePath.lastIndexOf('.')
      const processor = this.getParser(filePath.substring(lastIndexOf + 1))
      if (processor instanceof CsvFileProcessor) return await processor.process(filePath)
    }
    throw new Error('File type is not supported')
  }
}

class CsvFileProcessor {
  async process (filePath) {
    try {
      return await csv(fs.createReadStream(filePath), {
        mapHeaders: (header) => headers[header.index],
        strict: true,
        skipComments: true
      })
    } catch (err) {
      throw new Error('Error reading data')
    }
  }
}

module.exports = { FileParsingStrategy, CsvFileProcessor }
