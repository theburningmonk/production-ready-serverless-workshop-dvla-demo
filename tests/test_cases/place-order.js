const { expect } = require('chai')
const when = require('../steps/when')
const { init } = require('../steps/init')
const AWS = require('mock-aws')

describe(`When we invoke the POST /orders endpoint`, () => {
  let isEventPublished = false
  let resp

  before(async () => {
    await init()

    AWS.mock('Kinesis', 'putRecord', (req) => {
      isEventPublished = 
        req.StreamName === process.env.order_events_stream &&
        JSON.parse(req.Data).eventType === 'order_placed'

      return {
        promise: async () => {}
      }
    })

    resp = await when.we_invoke_place_order('Fangtasia')
  })

  after(() => AWS.restore('Kinesis', 'putRecord'))

  it(`Should return 200`, async () => {
    expect(resp.statusCode).to.equal(200)
  })
  
  if (process.env.TEST_MODE === 'handler') {
    it(`Should publish a message to Kinesis stream`, async () => {
      expect(isEventPublished).to.be.true
    })
  }
})