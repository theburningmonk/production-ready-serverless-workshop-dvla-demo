const Log = require('../lib/log')

// config should be { sampleRate: double } where sampleRate is between 0.0-1.0
module.exports = (config) => {
  const sampleRate = config ? config.sampleRate || 0.01 : 0.01 // defaults to 1%
  let rollback = undefined

  const isDebugEnabled = () => {
    return sampleRate && Math.random() <= sampleRate
  }

  return {
    before: (handler, next) => {
      if (isDebugEnabled()) {
        rollback = Log.enableDebug()
      }

      next()
    },
    after: (handler, next) => {
      if (rollback) {
        rollback()
      }

      next()
    },
    onError: (handler, next) => {
      let awsRequestId = handler.context.awsRequestId
      let invocationEvent = JSON.stringify(handler.event)
      Log.error('invocation failed', { awsRequestId, invocationEvent }, handler.error)
      
      next(handler.error)
    }
  }
}