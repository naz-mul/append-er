const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const inquirer = require('inquirer')
const config = require('../../commands/config')
const ConfigManager = require('../../lib/config-manager')
const path = require('path')
const fs = require('fs')

chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.use(dirtyChai)

describe('the config command module', () => {
  const ENV_NAME = 'append-er-test'
  let confManager, sandbox
  before(() => {
    confManager = new ConfigManager(ENV_NAME)
  })
  beforeEach(async () => {
    sandbox = sinon.createSandbox()
    sandbox.stub(inquirer, 'prompt').resolves({ env: 'Development', baseUri: 'http://interview.wpengine.io/v1' })
    await config.env(ENV_NAME)
  })

  it('should create env config when not found', async () => {
    const [env, baseUri] = await confManager.getEnvironmentConfig()
    expect(env).to.be.equal('Development')
    expect(baseUri).to.be.equal('http://interview.wpengine.io/v1')
    expect(inquirer.prompt.calledOnce).to.be.true()
  })

  it('should show config already exists', async () => {
    sandbox.spy(console, 'error')
    await config.env(ENV_NAME)
    expect(console.error.calledWith('Environment config already exists')).to.be.true()
  })

  it('should reset env config when found', async () => {
    await config.reset(ENV_NAME)
    return expect(confManager.getEnvironmentConfig())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('message', 'No environment config found')
  })

  it('should show config not found', async () => {
    sandbox.spy(console, 'error')
    await config.reset(ENV_NAME)
    await config.reset(ENV_NAME)
    expect(console.error.calledWith('No configurations found')).to.be.true()
  })

  afterEach(() => {
    sandbox.restore()
  })
  after((done) => {
    fs.unlink(path.join(process.env.HOME, '.config', 'configstore', `${ENV_NAME}.json`), done)
  })
})
