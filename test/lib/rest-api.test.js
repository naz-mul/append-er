const chai = require('chai')
const sinon = require('sinon')
const RestApi = require('../../lib/rest-api')
const expect = chai.expect

describe('the rest api', () => {
  let api
  const receivedData = {
    data: {
      account_id: 12345, status: 'good', created_on: '2011-01-12'
    }
  }
  before(() => {
    api = new RestApi(['Development', 'google.com'])
  })

  it('should get the account', async () => {
    sinon.stub(api, 'getAccount').resolves({ status: 200, data: receivedData })
    const response = await api.getAccount('12345')
    expect(response.status).to.be.equal(200)
    expect(response.data).to.be.equal(receivedData)
    api.getAccount.restore()
  })
})
