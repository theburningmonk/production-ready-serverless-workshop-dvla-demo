const CorrelationIds = require('./correlation-ids')

const LogLevels = {
  DEBUG : 0,
  INFO  : 1,
  WARN  : 2,
  ERROR : 3
}

// most of these are available through the Node.js execution environment for Lambda, see the following for details
// https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html
const DEFAULT_CONTEXT = {
  awsRegion: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
  functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
  functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
  functionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
  stage: process.env.ENVIRONMENT || process.env.STAGE
}

// default to debug if not specified
const logLevelName = () => process.env.log_level || 'DEBUG'

const isEnabled = (level) => level >= LogLevels[logLevelName()]

function appendError(params, err) {
  if (!err) {
    return params
  }

  return Object.assign(
    { },
    params || { }, 
    { errorName: err.name, errorMessage: err.message, stackTrace: err.stack }
  )
}

function getContext () {
  // if there's a global variable for all the current request context then use it
  const context = CorrelationIds.get()
  if (context) {
    // note: this is a shallow copy, which is ok as we're not going to mutate anything
    return Object.assign({}, DEFAULT_CONTEXT, context)
  }

  return DEFAULT_CONTEXT
}

function log (levelName, message, params) {
  if (!isEnabled(LogLevels[levelName])) {
    return
  }

  let context = getContext()
  let logMsg = Object.assign({}, context, params)
  logMsg.level = levelName
  logMsg.message = message

  console.log(JSON.stringify(logMsg))
}

function enableDebug() {
  const oldLevel = process.env.log_level
  process.env.log_level = 'DEBUG'

  return () => {
    process.env.log_level = oldLevel
  }
}

module.exports = {
  debug: (msg, params) => log('DEBUG', msg, params),
  info: (msg, params) => log('INFO',  msg, params),
  warn: (msg, params, error) => log('WARN',  msg, appendError(params, error)),
  error: (msg, params, error) => log('ERROR', msg, appendError(params, error)),
  enableDebug
}