const CorrelationIds = require('./correlation-ids')
const AWSXRay = require('aws-xray-sdk-core')
const https = process.env.LAMBDA_RUNTIME_DIR
  ? AWSXRay.captureHTTPs(require('https'))
  : require('https')

// options: {
//    hostname : string
//    method   : GET | POST | PUT | HEAD
//    path     : string
//    headers  : object
//  }
// for all intents and purposes you can think of this as `https.request`
const Req = (options, cb) => {
  const context = CorrelationIds.get()

  // copy the provided headers last so it overrides the values from the context
  const headers = Object.assign({}, context, options.headers || {})

  options.headers = headers

  return https.request(options, cb)
}

module.exports = {
  request: Req
}