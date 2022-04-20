import express from 'express'
import path from 'path'
import cors from 'cors'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'

import shortid from 'shortid'

import config from './config'
import mongooseService from './services/mongoose'
import User from './model/User.model'

import Html from '../client/html'

const { readFile, writeFile } = require('fs').promises

require('colors')

mongooseService.connect()

const user = new User({
  email: 'test@gmail.com',
  password: 'hello'
})
user.save()

let Root
try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const getChannels = () => {
  return readFile(`${__dirname}/data/channels.json`, 'utf-8')
    .then((string) => {
      return JSON.parse(string)
    })
    .catch(async () => {
      await writeFile(`${__dirname}/data/channels.json`, JSON.stringify({}), 'utf-8')
      return {}
    })
}

server.get('/api/v1/channels', async (req, res) => {
  const channels = await getChannels()
  res.json(channels)
})

server.post('/api/v1/channels', async (req, res) => {
  const { title } = req.body
  const channels = await getChannels()
  const updatedChannels = { ...channels, [title]: { usersId: [], messages: [] } }
  await writeFile(`${__dirname}/data/channels.json`, JSON.stringify(updatedChannels), 'utf-8')
  res.json(updatedChannels)
})

server.post('/api/v1/channel', async (req, res) => {
  const { id, channel, action } = req.body
  const channels = await getChannels()
  const updatedChannels = {
    ...channels,
    [channel]: {
      ...channels[channel],
      usersId:
        action === 'login'
          ? [...channels[channel].usersId, id]
          : channels[channel].usersId.filter((el) => el !== id)
    }
  }
  await writeFile(`${__dirname}/data/channels.json`, JSON.stringify(updatedChannels), 'utf-8')
  res.json(updatedChannels)
})

const setMessage = (id, messageText) => {
  return {
    userId: id,
    messageId: shortid.generate(),
    messageStr: messageText,
    messageDate: new Date(),
    meta: {}
  }
}

server.post('/api/v1/channel/message', async (req, res) => {
  const { currentChannel, id, message } = req.body
  const channels = await getChannels()
  const updatedChannels = {
    ...channels,
    [currentChannel]: {
      ...channels[currentChannel],
      messages: [...channels[currentChannel].messages, setMessage(id, message)]
    }
  }
  await writeFile(`${__dirname}/data/channels.json`, JSON.stringify(updatedChannels), 'utf-8')
  res.json(updatedChannels)
})

server.post('/api/v1/auth', async (req, res) => {
  console.log(req.body)
  res.json({ status: 'ok' })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
