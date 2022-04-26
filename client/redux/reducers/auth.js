import Cookies from 'universal-cookie'
import { history } from '../index'

const UPDATE_EMAIL = '@chat/auth/UPDATE_EMAIL'
const UPDATE_PASSWORD = '@chat/auth/UPDATE_PASSWORD'
const UPDATE_CONFIRM_PASSWORD = '@chat/auth/UPDATE_CONFIRM_PASSWORD'
const LOGIN = '@chat/auth/LOGIN'
const REGISTER = '@chat/auth/REGISTER'

const cookies = new Cookies()

const initialState = {
  email: '',
  password: '',
  confirmPassword: '',
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
    case UPDATE_CONFIRM_PASSWORD: {
      return {
        ...state,
        confirmPassword: action.confirmPassword
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
    case REGISTER: {
      return {
        ...state,
        email: action.email,
        password: action.password,
        confirmPassword: action.confirmPassword
      }
    }
    default:
      return state
  }
}

export function updateEmailField(email) {
  return { type: UPDATE_EMAIL, email }
}

export function updatePasswordField(password) {
  return { type: UPDATE_PASSWORD, password }
}

export function updateConfirmPassword(confirmPassword) {
  return { type: UPDATE_CONFIRM_PASSWORD, confirmPassword }
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
  return (dispatch, getState) => {
    const { pathname } = getState().router.location
    fetch('/api/v1/auth')
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: LOGIN, token: data.token, user: data.user, password: '' })
        if (data.status === 'ok' && pathname !== '/admin') {
          history.push('/chat')
        }
      })
  }
}

export function tryGetUserInfo() {
  return () => {
    fetch('/api/v1/user-info')
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 'ok') {
          history.push('/chat')
        }
      })
  }
}

export function signUp(email, password, confirmPassword) {
  return async (dispatch) => {
    if (password !== confirmPassword) {
      return {
        type: REGISTER,
        password: `Password doesn't match!`,
        confirmPassword: `Password doesn't match!`
      }
    }
    return fetch('/api/v1/auth/register', {
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
        if (data.status === 'ok') {
          dispatch({ type: REGISTER, email: 'Success', password: '', confirmPassword: '' })
        }
        dispatch({ type: REGISTER, email: data.err, password: '', confirmPassword: '' })
      })
  }
}
