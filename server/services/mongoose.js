const mongoose = require('mongoose')

const config = require('../config')

mongoose.connection.on('connected', () => {
  console.log('db is connected')
})

mongoose.connection.on('error', (err) => {
  console.log(`cannot connect to db, error: ${err}`)
  process.exit(1)
})

exports.connect = async (mongoURL = config.default.mongoURL) => {
  mongoose.connect(mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  return mongoose.connection
}
