const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const parse = require('../../commands/parse')
const FileParsingStrategy = require('../../lib/file-parser').FileParsingStrategy
const CsvFileProcessor = require('../../lib/file-parser').CsvFileProcessor
const path = require('path')
const fs = require('fs')

chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.use(dirtyChai)

describe('the parse command module', () => {
  let parsingStrategy, processor, sandbox
  before(() => {
    parsingStrategy = new FileParsingStrategy()
    processor = new CsvFileProcessor()
  })
  beforeEach(async () => {
    sandbox = sinon.createSandbox()
  })
  it('should read a csv file', async () => {
    parsingStrategy.addParser(processor, 'csv')
    sandbox.spy(console, 'info')
    await parse.processFile(path.resolve(__dirname, '../resources/input.csv'), path.resolve(__dirname, '../resources/output.csv'))
    expect(console.info.calledWith('File successfully read')).to.be.true()
  })

  it('should not read csv file from invalid path', async () => {
    sandbox.spy(console, 'error')
    await parse.processFile(path.resolve(__dirname, '../resources/inputt.csv'), path.resolve(__dirname, '../resources/output.csv'))
    expect(console.error.calledOnce).to.be.true()
  })

  it('should write a csv file', async () => {
    parsingStrategy.addParser(processor, 'csv')
    sandbox.spy(console, 'info')
    await parse.processFile(path.resolve(__dirname, '../resources/input.csv'), path.resolve(__dirname, '../resources/output.csv'))
    expect(console.info.calledWith('File successfully written')).to.be.true()
  })
  afterEach(() => {
    sandbox.restore()
  })
})
