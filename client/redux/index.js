import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { io } from 'socket.io-client'
import Cookies from 'universal-cookie'

import rootReducer from './reducers'
import createHistory from './history'

import { ADD_CHANNEL, SWITCH_CHANNEL } from './reducers/channels'

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [thunk, routerMiddleware(history)]

const composeFunc = process.env.NODE_ENV === 'development' ? composeWithDevTools : compose

const composedEnhancers = composeFunc(applyMiddleware(...middleware), ...enhancers)

const store = createStore(rootReducer(history), initialState, composedEnhancers)

const cookies = new Cookies()

const socket = io('/', {
  auth: {
    token: cookies.get('token')
  }
})

socket.on('updateChannels', (payload) => {
  // почему-то не хочет строку парсить целиком
  return store.dispatch({ type: ADD_CHANNEL, channelsArray: JSON.parse(payload) })

  // примерный вид action = { type: UPDATE_MESSAGES, channelsList: payload }
  // store.dispatch(JSON.parse(message))
  // то есть, с сервера отправлять команды/экшены напрямую в редакс
  // без редакса, описание сокетов внутрь юзэффекта и на уровне рутов сделать
})

// socket.on('updateChannel', (payload, channelId) => {
//   return store.dispatch({ type: SWITCH_CHANNEL, channelsArray: JSON.parse(payload), channelId: JSON.parse(channelId) })
// })

socket.on('updateChannel', (payload) => {
  return store.dispatch({ type: SWITCH_CHANNEL, channelsArray: JSON.parse(payload) })
})

// socket.on('disconect', () => {
//   socket.emit(switchChannel(store.channel.currentChannel))
// })

export default store
