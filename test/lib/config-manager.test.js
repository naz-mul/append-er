const path = require('path')
const fs = require('fs')
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const ConfigManager = require('../../lib/config-manager')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the config manager', () => {
  let conf, env, baseUri
  before(async () => {
    conf = new ConfigManager('append-er-test')
    await conf.saveEnvironmentConfig('Development', 'http://interview.wpengine.io/v1')
  })
  it('should return the env config when found', async () => {
    [env, baseUri] = await conf.getEnvironmentConfig()
    expect(env).to.equal('Development')
    expect(baseUri).to.equal('http://interview.wpengine.io/v1')
  })

  it('should reject when no config is found', async () => {
    [env, baseUri] = await conf.getEnvironmentConfig()
    await conf.deleteEnvironmentConfig(env, baseUri)
    expect(conf.getEnvironmentConfig()).to.be.rejected()
  })
  after((done) => {
    fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'append-er-test.json'), done)
  })
})
