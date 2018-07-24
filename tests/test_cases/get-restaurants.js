const { expect } = require('chai')
const { init } = require('../steps/init')
const when = require('../steps/when')

describe(`When we invoke the GET /restaurants endpoint`, () => {
  before(async () => await init())

  it(`Should return an array of 8 restaurants`, async () => {
    let res = await when.we_invoke_get_restaurants()

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.have.lengthOf(8)

    for (let restaurant of res.body) {
      expect(restaurant).to.have.property('name')
      expect(restaurant).to.have.property('image')
    }
  })
})