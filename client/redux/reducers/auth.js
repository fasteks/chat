import Cookies from 'universal-cookie'
import { history } from '../index'

const UPDATE_EMAIL = '@chat/auth/UPDATE_EMAIL'
const UPDATE_PASSWORD = '@chat/auth/UPDATE_PASSWORD'
const LOGIN = '@chat/auth/LOGIN'

const cookies = new Cookies()
const initialState = {
  email: '',
  password: '',
  token: cookies.get('token'),
  user: {}
  // user: {
  //   name: 'fasteks',
  //   id: '28',
  //   isOnline: true
  // }
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_EMAIL: {
      return {
        ...state,
        email: action.email
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
        token: action.token,
        user: action.user,
        password: action.password
      }
    }
    default:
      return state
  }
}

export function updateLoginField(email) {
  return { type: UPDATE_EMAIL, email }
}

export function updatePasswordField(password) {
  return { type: UPDATE_PASSWORD, password }
}

export function signIn() {
  return (dispatch, getState) => {
    const { email, password } = getState().auth
    fetch('/api/v1/auth', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: LOGIN, token: data.token, user: data.user, password: '' })
        history.push('/chat')
      })
  }
}

export function trySignIn() {
  return (dispatch) => {
    fetch('/api/v1/auth')
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: LOGIN, token: data.token, user: data.user, password: '' })
        history.push('/chat')
      })
  }
}

export function tryGetUserInfo() {
  return () => {
    fetch('/api/v1/user-info')
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line
        console.log(data)
      })
  }
}
