const UPDATE_LOGIN = '@chat/auth/UPDATE_LOGIN'
const UPDATE_PASSWORD = '@chat/auth/UPDATE_PASSWORD'

const initialState = {
  login: '',
  password: '',
  token: '',
  user: {
    name: 'fasteks',
    id: '28',
    isOnline: true
  }
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_LOGIN: {
      return {
        ...state,
        login: action.login
      }
    }
    case UPDATE_PASSWORD: {
      return {
        ...state,
        password: action.password
      }
    }
    default:
      return state
  }
}

export function updateLoginField(login) {
  return { type: UPDATE_LOGIN, login }
}

export function updatePasswordField(password) {
  return { type: UPDATE_PASSWORD, password }
}
