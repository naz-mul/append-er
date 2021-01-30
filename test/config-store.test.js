const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const inquirer = require('inquirer')
const ConfigManager = require('../lib/config-store')

chai.use(dirtyChai)

describe('a config manager', () => {
  let conf
  before(() => {
    conf = new ConfigManager('appender-test')
  })

  context('with no existing config', () => {
    it('should prompt the user', async () => {
      sinon.stub(inquirer, 'prompt').resolves({ env: 'Development', baseUri: 'http://interview.wpengine.io/v1' })
      const [env, baseUri] = await conf.getConfig()
      expect(env).to.equal('Development')
      expect(baseUri).to.equal('http://interview.wpengine.io/v1')
      expect(inquirer.prompt.calledOnce).to.be.true()
      inquirer.prompt.restore()
    })
  })

  context('with existing config', () => {
    it('should not prompt the user', async () => {
      const [env, baseUri] = await conf.getConfig()
      expect(env).to.equal('Development')
      expect(baseUri).to.equal('http://interview.wpengine.io/v1')
    })
    after(() => {
      conf.conf.delete('env')
      conf.conf.delete('baseUri')
    })
  })
})
