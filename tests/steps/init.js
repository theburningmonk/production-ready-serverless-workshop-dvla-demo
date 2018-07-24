let initialized = false

const init = async () => {
  if (initialized) {
    return
  }

  process.env.restaurants_api   = "https://7md1iyjlxf.execute-api.eu-west-1.amazonaws.com/dev/restaurants"
  process.env.restaurants_table = "restaurants-dev-yancui"
  process.env.AWS_REGION        = "eu-west-1"
  process.env.order_events_stream = 'orders-dev-yancui'
  process.env.restaurant_notification_topic = 'restaurants-dev-yancui'
  
  initialized = true
}

module.exports = {
  init
}