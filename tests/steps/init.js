const _ = require('lodash')
const { promisify } = require('util')
const awscred = require('awscred')
const { REGION, STAGE } = process.env
const AWS = require('aws-sdk')
AWS.config.region = REGION
const SSM = new AWS.SSM()

let initialized = false

const getParameters = async (keys) => {
  const prefix = `/workshop-yancui/${STAGE}/`
  const req = {
    Names: keys.map(key => `${prefix}${key}`)
  }
  const resp = await SSM.getParameters(req).promise()
  return _.reduce(resp.Parameters, function(obj, param) {
    obj[param.Name.substr(prefix.length)] = param.Value
    return obj
   }, {})
}

const init = async () => {
  if (initialized) {
    return
  }

  const params = await getParameters([
    'table_name',
    'stream_name',
    'restaurant_topic_name',
    'url'
  ])

  console.log('SSM params loaded')

  process.env.TEST_ROOT                     = params.url
  process.env.orders_api                    = `${params.url}/orders`
  process.env.restaurants_api               = `${params.url}/restaurants`
  process.env.restaurants_table             = params.table_name
  process.env.AWS_REGION                    = REGION
  process.env.order_events_stream           = params.stream_name
  process.env.restaurant_notification_topic = params.restaurant_topic_name
  process.env.AWS_XRAY_CONTEXT_MISSING = 'LOG_ERROR'
  
  initialized = true
}

module.exports = {
  init
}