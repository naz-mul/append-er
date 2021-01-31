const fs = require('fs')
const csv = require('@fast-csv/format')
const neatCsv = require('neat-csv')

class CsvFileFormatter {
  static async write (filestream, rows, options) {
    try {
      return await csv.writeToStream(filestream, rows, options)
    } catch (err) {
      throw new Error(err)
    }
  }

  constructor (opts) {
    this.headers = opts.headers
    this.path = opts.path
    this.writeOpts = { headers: this.headers, includeEndRowDelimiter: true }
  }

  async create (rows) {
    return await CsvFileFormatter.write(fs.createWriteStream(this.path), rows, { ...this.writeOpts })
  }

  async read () {
    try {
      return await neatCsv(fs.createReadStream(this.path), {
        mapHeaders: (header) => this.headers[header.index],
        strict: true,
        skipComments: true
      })
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = CsvFileFormatter
