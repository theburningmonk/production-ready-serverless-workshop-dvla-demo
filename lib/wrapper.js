const middy = require('middy')
const sampleLogging = require('../middleware/sample-logging')
const captureCorrelationIds = require('../middleware/capture-correlation-ids')

module.exports = (f) => {
  return middy(f)
    .use(captureCorrelationIds({ sampleDebugLogRate: 0.01 }))
    .use(sampleLogging({ sampleRate: 0.01 }))
}