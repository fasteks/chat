import express from 'express'
import path from 'path'
import cors from 'cors'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import shortid from 'shortid'

import passport from 'passport'
import jwt from 'jsonwebtoken'

import config from './config'
import mongooseService from './services/mongoose'
import passportJWT from './services/passport'
// import User from './model/User.model'
import Channel from './model/Channel.model'
import auth from './middleware/auth'
import authRoute from './routes/auth.route'

import Html from '../client/html'

const { writeFile } = require('fs').promises

require('colors')

mongooseService.connect()

let Root
try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  // eslint-disable-next-line
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

const port = process.env.PORT || 8090
const app = express()

let connections = []

const middleware = [
  cors(),
  // Passport is an authentication middleware for Node that authenticates requests.
  // So basically passport.initialize() initialises the authentication module.
  // To use Passport in an Express - configure it with the required middleware
  passport.initialize(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser()
]

// Для того чтобы загрузить функцию промежуточного обработчика
// вызовите app.use() с указанием соответствующей функции
// КАЖДЫЙ раз при получении запроса приложение будет запускать весь следующий мидлвэр!
middleware.forEach((it) => app.use(it))
// эквивалентная запись либо app.use(r1, r2) и пр.
// app.use(middleware)

// In cases where there is a naming conflict, or the default name is not sufficiently descriptive,
// the name can be overridden when registering the strategy by passing a name as the first argument to .use():
// регистрация стратегии под именем 'jwt' в "поле видимости" библиотеки passport
passport.use('jwt', passportJWT.jwt)

// Kitten.find({}).then(it => console.log(it.map(e => e.speak())))

// вынесли использование мидлвэр аутентификации пользователя auth в отдельный файл,
// чтоб не раздувать server.js, а тут его применяем, к выбранному нами запросу
// по логике: стратегия помогает найти пользователя где-то,
// а вот обработать его содержимое под наши нужды (разрешить/запретить переход по пути)
// уже делает auth middleware
// passportJWT ищет user по token, auth обрабатывает содержимое user
app.get('/api/v1/user-info', auth(['admin']), (req, res) => {
  res.json({ status: 'ok' })
})

// Данное приложение теперь может обрабатывать запросы, адресованные на api/v1/auth
// если большой проект с кучей роутов, этот файл будет целой простыней текста
// вынесли функции для лучшей струтурированность/читаемости в отдельный файл
app.use('/api/v1/auth', authRoute)

// app.get('/api/v1/auth', async (req, res) => {
//   try {
//     const jwtUser = jwt.verify(req.cookies.token, config.secret)
//     const user = await User.findById(jwtUser.uid)
//     const payload = { uid: user.id }
//     const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
//     delete user.password
//     res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
//     res.json({ status: 'ok', token, user })
//   } catch (err) {
//     res.json({ status: 'error', err })
//   }
// })

// // для успешной авторизации необходимо добавить токен
// // для этого нужно расширить api для бд

// app.post('/api/v1/auth', async (req, res) => {
//   try {
//     const user = await User.findAndValidateUser(req.body)
//     const payload = { uid: user.id }
//     delete user.password
//     const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
//     res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
//     res.json({ status: 'ok', token, user })
//   } catch (err) {
//     res.json({ status: 'error', err })
//   }
// })

const getChannels = () => {
  return Channel.find({})
    .then((it) => it)
    .catch((err) => err)
}

// отправлять инфу другим - можно и через connection.emit внутри тела обработчика любого api выше
// listOfNeededIds - массив определенных нами id из db
// connections.filter(({ id }) => listOfNeededIds.includes(id))
// выбор нужных наших id (среди списка всех активных сокетов) для выполнения на них eventa
// .forEach((conn) => conn.emit('chatMessage', JSON.stringify({ type: UPDATE_MEESSAGES, messageList: message })))
// отправка каждому выбранного сокету экшена для исполнения в редакс.
// общение всегда через строку, {UPDATE_MEESSAGES, messageList - ключи в сторе редакса, message - новый payload

app.get('/api/v1/channels', async (req, res) => {
  const channels = await getChannels()
  // console.log('channels', channels)
  res.json(channels)
  // const action = { type: GET_CHANNELS, channelsObj: channels }
  // connections.forEach((conn) => {
  //   conn.emmit('getChannels', JSON.stringify(action))
  // })
})

app.post('/api/v1/channels', async (req, res) => {
  // const { title } = req.body
  // const channels = await getChannels()
  // const updatedChannels = { ...channels, [title]: { usersId: [], messages: [] } }
  // await writeFile(`${__dirname}/data/channels.json`, JSON.stringify(updatedChannels), 'utf-8')
  // res.json(updatedChannels)
  const { channelTitle } = req.body
  const channels = await getChannels()
  const isUniqueChannel = !channels.includes(channelTitle)
  const newChannel = new Channel({ title: channelTitle })
  await newChannel.save()
  const updatedChannels = await getChannels()
  if (isUniqueChannel) {
    return connections.forEach((conn) => {
      conn.emit('updateChannels', JSON.stringify(updatedChannels))
    })
  }
  console.log('cannot add new channel')
  return res.json('something wrong')
})

app.post('/api/v1/channel', async (req) => {
  const { channelId, userId } = req.body
  // console.log('channelId', channelId)
  // console.log('userId', userId)

  const channel = await Channel.findOne({ _id: channelId })
  // console.log('channel', channel)

  const updatedUsersOnChannel = channel.usersOnChannel.includes(userId)
    ? channel.usersOnChannel.filter((id) => id !== userId)
    : [...channel.usersOnChannel, userId]
  // console.log('updatedUsersOnChannel', updatedUsersOnChannel)

  // const updatedChannel = { ...channel._doc, usersOnChannel: updatedUsersOnChannel }
  // console.log('updatedChannel', updatedChannel)

  await Channel.updateOne({ _id: channelId }, { usersOnChannel: updatedUsersOnChannel })

  const updatedChannels = await Channel.find({})
  // console.log('updatedChannels', updatedChannels)

  return connections.forEach((conn) => {
    conn.emit('updateChannel', JSON.stringify(updatedChannels))
  })
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

app.post('/api/v1/channel/message', async (req, res) => {
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

app.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

app.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

app.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const http = require('http')

const server = http.createServer(app)

const { Server } = require('socket.io')

const io = new Server(server)

// а получение инфы извне должно описываться здесь, ниже - псевдокод
// connection.on('event.name', eventHanlderFunc(event.payload) { })
// eventHandlerFunc может лежать в отдельном специально выделенном файле
io.on('connection', (connection) => {
  try {
    if (connection.handshake.auth.token) {
      const user = jwt.verify(connection.handshake.auth.token, config.secret)
      // eslint-disable-next-line
      connection.userId = user.uid
      connections.push(connection)
    }

    // connection.emit('chatMessage', JSON.stringify({ message: 'hello world from api' }))
  } catch (err) {
    console.log('error:', err)
  } finally {
    connection.on('disconnect', () => {
      connections = connections.filter((it) => it.id !== connection.id)
    })
    // console.log('current connections:', connections)
    console.log(
      'current connections:',
      connections.map((it) => it.userId)
    )
  }
})

server.listen(port)

// let connections = []
// if (config.isSocketsEnabled) {
//   const echo = sockjs.createServer()
//   echo.on('connection', (conn) => {
//     connections.push(conn)
//     conn.on('data', async () => {})

//     conn.on('close', () => {
//       connections = connections.filter((c) => c.readyState !== 3)
//     })
//   })
//   echo.installHandlers(app, { prefix: '/ws' })
// }

// eslint-disable-next-line
console.log(`Serving at http://localhost:${port}`)
