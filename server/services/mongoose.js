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

// same as if we write
// exports default async (mongoURL = config.mongoURL) => {
// it's just writes connect func into exports obj of whole mongoose.js file
exports.connect = async (mongoURL = config.mongoURL) => {
  mongoose.connect(mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  return mongoose.connection
}
