const middy = require('middy')
const sampleLogging = require('../middleware/sample-logging')

module.exports = (f) => {
  return middy(f).use(sampleLogging({ sampleRate: 0.1 }))
}