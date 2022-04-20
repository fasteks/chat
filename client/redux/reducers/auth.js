const UPDATE_LOGIN = '@chat/auth/UPDATE_LOGIN'
const UPDATE_PASSWORD = '@chat/auth/UPDATE_PASSWORD'
const LOGIN = '@chat/auth/LOGIN'

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
    case LOGIN: {
      return {
        ...state,
        token: action.password
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

export function signIn() {
  return (dispatch, getState) => {
    const { login, password } = getState().auth
    fetch('/api/v1/auth', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login,
        password
      })
    })
      .then((res) => res.json)
      .then((data) => {
        dispatch({ type: LOGIN, token: data.token })
      })
  }
}
