const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const chaiAsPromised = require('chai-as-promised')
const FileParsingStrategy = require('../../lib/file-parser').FileParsingStrategy
const CsvFileProcessor = require('../../lib/file-parser').CsvFileProcessor
const path = require('path')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the file parser', () => {
  it('should get the parser', () => {
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser(new CsvFileProcessor(), 'csv')
    const parser = parsingStrategy.getParser('csv')
    expect(parser).to.be.eql(new CsvFileProcessor())
  })

  it('should not get the parser when invalid parser added', () => {
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser({}, 'text')
    expect(() => {
      parsingStrategy.getParser('csv')
    }).to.throw('No file parser found')
  })

  it('should not get the parser when no parser added', () => {
    const parsingStrategy = new FileParsingStrategy()
    expect(() => {
      parsingStrategy.getParser('csv')
    }).to.throw('No file parser found')
  })

  it('should read csv file', async () => {
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser(new CsvFileProcessor(), 'csv')
    const data = await parsingStrategy.read(path.resolve(__dirname, '../resources/input.csv'))
    expect(Array.from(data).length).to.be.eq(7)
  })

  it('should not read csv file from invalid path', async () => {
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser(new CsvFileProcessor(), 'csv')
    return expect(parsingStrategy.read(path.resolve(__dirname, '../resources/inputt.csv')))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('message', `Error: ENOENT: no such file or directory, open '${path.resolve(__dirname, '../resources/inputt.csv')}'`)
  })

  it('should not read csv file with incorrect amount of headers', async () => {
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser(new CsvFileProcessor(), 'csv')
    return expect(parsingStrategy.read(path.resolve(__dirname, '../resources/invalid-header.csv')))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('message', 'RangeError: Row length does not match headers')
  })

  it('should not read csv file with invalid data', async () => {
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser(new CsvFileProcessor(), 'csv')
    return expect(parsingStrategy.read(path.resolve(__dirname, '../resources/invalid-data.csv')))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('message', 'RangeError: Row length does not match headers')
  })

  it('should throw error for invalid parser', () => {
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser({}, 'txt')
    return expect(parsingStrategy.read(path.resolve(__dirname, '../resources/input.csv')))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('message', 'No file parser found')
  })

  it('should throw error for invalid file type', () => {
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser(new CsvFileProcessor(), 'csv')
    return expect(parsingStrategy.read(path.resolve(__dirname, '../resources/input.txt')))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('message', 'File type is not supported')
  })

  it('should write csv file', async () => {
    const outputData = [{
      'Account ID': 12345,
      'First Name': 'Interview',
      'Created On': '2021-02-01',
      Status: 'hired',
      'Status Set On': '2021-02-14'
    }]
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser(new CsvFileProcessor(), 'csv')
    const data = await parsingStrategy.write(outputData, path.resolve(__dirname, '../resources/output.csv'))
    expect(data.writable).to.be.true
  })

  it('should throw error for invalid write parser', () => {
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser({}, 'txt')
    return expect(parsingStrategy.write([], path.resolve(__dirname, '../resources/input.csv')))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('message', 'No file parser found')
  })

  it('should throw error for invalid write file type', () => {
    const parsingStrategy = new FileParsingStrategy()
    parsingStrategy.addParser(new CsvFileProcessor(), 'csv')
    return expect(parsingStrategy.write([], path.resolve(__dirname, '../resources/input.txt')))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('message', 'File type is not supported')
  })
})
