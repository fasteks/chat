import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { io } from 'socket.io-client'
import Cookies from 'universal-cookie'

import rootReducer from './reducers'
import createHistory from './history'

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

// socket.on('connect', () => {
//   console.log('successful connection')
// })

socket.on('chatMessage', (message) => {
  console.log(message)
})

// import socketActions from './sockets'
// const isBrowser = typeof window !== 'undefined'
// let socket
// if (typeof ENABLE_SOCKETS !== 'undefined' && ENABLE_SOCKETS === 'true') {
//   const initSocket = () => {
//     socket = new SockJS(`${isBrowser ? window.location.origin : 'http://localhost'}/ws`)

//     socket.onopen = () => {
//       store.dispatch(socketActions.connected)
//     }

//     socket.onmessage = (message) => {
//       // eslint-disable-next-line no-console
//       console.log(message)

//       // socket.close();
//     }

//     socket.onclose = () => {
//       store.dispatch(socketActions.disconnected)
//       setTimeout(() => {
//         initSocket()
//       }, 2000)
//     }
//   }

//   initSocket()
// }
// export function getSocket() {
//   return socket
// }

export default store
