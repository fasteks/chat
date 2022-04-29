import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import auth from './auth'
import channels from './channels'
import admin from './admin'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    channels,
    admin
  })

export default createRootReducer
