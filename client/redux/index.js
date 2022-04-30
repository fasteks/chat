import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { io } from 'socket.io-client'
import Cookies from 'universal-cookie'
import { parse } from 'flatted'

import rootReducer from './reducers'
import createHistory from './history'

import { ADD_CHANNEL, GET_CHANNELS } from './reducers/channels'
import { UPDATE_USERS } from './reducers/admin'

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [thunk, routerMiddleware(history)]

const composeFunc = process.env.NODE_ENV === 'development' ? composeWithDevTools : compose

const composedEnhancers = composeFunc(applyMiddleware(...middleware), ...enhancers)

const store = createStore(rootReducer(history), initialState, composedEnhancers)

const cookies = new Cookies()

export const socket = io('/', {
  reconnection: true,
  reconnectionDelay: 500,
  autoConnect: true,
  reconnectionAttempts: 50,
  auth: {
    token: cookies.get('token')
  }
})

socket.on('connect', () => {
  // console.log('socket connected')
})

socket.on('updateChannels', (payload) => {
  // почему-то не хочет строку парсить целиком
  return store.dispatch({ type: ADD_CHANNEL, channelsArray: JSON.parse(payload) })

  // примерный вид action = { type: UPDATE_MESSAGES, channelsList: payload }
  // store.dispatch(JSON.parse(message))
  // то есть, с сервера отправлять команды/экшены напрямую в редакс
  // без редакса, описание сокетов внутрь юзэффекта и на уровне рутов сделать
})

// запись строки в редакс из предварительно сохраненной записи в дб
socket.on('updateMessages', (payload) => {
  return store.dispatch({ type: GET_CHANNELS, channelsArray: JSON.parse(payload) })
})

// // запись строки только в редакс без записи в дб
// socket.on('updateMessages', (payload) => {
//   const data = JSON.parse(payload)
//   const { channels } = store.getState().channels

//   const updatedChannels = channels.map((it) => {
//     if (it.title === data.currentChannel) {
//       return {
//         ...it,
//         messagesList: [...it.messagesList, data.newMessage]
//       }
//     }
//     return it
//   })

//   return store.dispatch({ type: GET_CHANNELS, channelsArray: updatedChannels })
// })

socket.on('updateUsers', (payload) => {
  return store.dispatch({ type: UPDATE_USERS, users: parse(payload) })
})

socket.on('logout', () => {
  window.location = ''
  cookies.remove('token')
  // return store.dispatch({ type: UPDATE_USERS, users: parse(payload) })
})

socket.on('disconnect', () => {
  // console.log('socket disconnect')
})

export default store
