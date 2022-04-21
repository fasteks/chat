require('dotenv').config()

const options = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  isSocketsEnabled: process.env.ENABLE_SOCKETS,
  mongoURL: process.env.MONGO_URL,
  // MONGO_URL=mongodb://127.0.0.1:27017
  // MONGO_URL=mongodb+srv://<login>:<password>@cluster0.tqzaf.mongodb.net/hello?retryWrites=true&w=majority
  secret: process.env.SECRET_JWT || 'secretKey'
}

export default options
