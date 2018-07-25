const clearAll = () => global.CONTEXT = undefined

const replaceAllWith = ctx => global.CONTEXT = ctx

const set = (key, value) => {
  if (!key.startsWith("x-correlation-")) {
    key = "x-correlation-" + key
  }

  if (!global.CONTEXT) {
    global.CONTEXT = {}
  }

  global.CONTEXT[key] = value;
}

const get = () => global.CONTEXT || {}

module.exports = {
  clearAll: clearAll,
  replaceAllWith: replaceAllWith,
  set: set,
  get: get
}