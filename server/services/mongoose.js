// eslint-disable-next-line
import mongoose from 'mongoose'
// eslint-disable-next-line
import config from '../config'

mongoose.connection.on('connected', () => {
  // eslint-disable-next-line
  console.log('db is connected')
})

mongoose.connection.on('error', (err) => {
  // eslint-disable-next-line
  console.log(`can not connect to db ${err}`)
  process.exit(1)
})

exports.connect = async (mongoURL = config.mongoURL) => {
  mongoose.connect(mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  return mongoose.connection
}
