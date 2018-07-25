const CorrelationIds = require('../lib/correlation-ids')
const Log = require('../lib/log')

function captureHttp(headers, awsRequestId, sampleDebugLogRate) {
  if (!headers) {
    Log.warn(`Request ${awsRequestId} is missing headers`)
    return
  }

  let context = { awsRequestId }
  for (const header in headers) {
    if (header.toLowerCase().startsWith('x-correlation-')) {
      context[header] = headers[header]
    }
  }

  if (!context['x-correlation-id']) {
    context['x-correlation-id'] = awsRequestId
  }

  // forward the original User-Agent on
  if (headers['User-Agent']) {
    context['User-Agent'] = headers['User-Agent']
  }

  if (headers['debug-log-enabled']) {
    context['debug-log-enabled'] = headers['debug-log-enabled']
  } else {
    context['debug-log-enabled'] = Math.random() < sampleDebugLogRate ? 'true' : 'false'
  }

  CorrelationIds.replaceAllWith(context)
}

function isApiGatewayEvent(event) {
  return event.hasOwnProperty('httpMethod')
}

module.exports = (config) => {
  const sampleDebugLogRate = config ? config.sampleDebugLogRate || 0.01 : 0.01 // defaults to 1%

  return {
    before: (handler, next) => {
      CorrelationIds.clearAll()

      if (isApiGatewayEvent(handler.event)) {
        captureHttp(handler.event.headers, handler.context.awsRequestId, sampleDebugLogRate)
      }

      next()
    }
  }
}