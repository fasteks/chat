require('dotenv').config()

const options = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  isSocketsEnabled: process.env.ENABLE_SOCKETS,
  mongoURL: process.env.MONGO_URL
  // MONGO_URL=mongodb://127.0.0.1:27017
  // MONGO_URL=mongodb+srv://<login>:<password>@cluster0.tqzaf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
}

export default options