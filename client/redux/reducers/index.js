import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import auth from './auth'
import channels from './channels'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    channels
  })

export default createRootReducer
