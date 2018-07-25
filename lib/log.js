const LogLevels = {
  DEBUG : 0,
  INFO  : 1,
  WARN  : 2,
  ERROR : 3
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

function log (levelName, message, params) {
  if (!isEnabled(LogLevels[levelName])) {
    return
  }

  let logMsg = Object.assign({}, params)
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