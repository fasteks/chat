import Cookies from 'universal-cookie'
import { history } from '../index'

const UPDATE_EMAIL = '@chat/auth/UPDATE_EMAIL'
const UPDATE_PASSWORD = '@chat/auth/UPDATE_PASSWORD'
const UPDATE_CONFIRM_PASSWORD = '@chat/auth/UPDATE_CONFIRM_PASSWORD'
const LOGIN = '@chat/auth/LOGIN'
const REGISTER = '@chat/auth/REGISTER'
const SET_RESPONSE = '@chat/auth/SET_RESPONSE'

const cookies = new Cookies()

const initialState = {
  email: '',
  password: '',
  confirmPassword: '',
  token: cookies.get('token'),
  user: {},
  response: ''
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
    case SET_RESPONSE: {
      return {
        ...state,
        response: action.response
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

export function updateResponse(response) {
  return { type: SET_RESPONSE, response }
}

// export function signIn() {
//   return async (dispatch, getState) => {
//     const { email, password } = getState().auth
//     await fetch('/api/v1/auth', {
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         email,
//         password
//       })
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         dispatch({ type: LOGIN, token: data.token, user: data.user, password: '' })
//         history.push('/chat')
//       })
//   }
// }

export function signIn(email, password) {
  return async (dispatch) => {
    await fetch('/api/v1/auth', {
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
          dispatch({ type: SET_RESPONSE, response: data.message })
          dispatch({ type: LOGIN, token: data.token, user: data.user, password: '' })
          history.push('/chat')
        } else {
          dispatch({ type: SET_RESPONSE, response: data.error })
        }
      })
      .catch((err) => err)
  }
}

export function trySignIn() {
  return async (dispatch, getState) => {
    const { pathname } = getState().router.location
    await fetch('/api/v1/auth')
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: LOGIN, token: data.token, user: data.user, password: '' })
        if (data.status === 'ok' && pathname !== '/admin') {
          history.push('/chat')
        }
      })
      .catch((err) => err)
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
      .catch((err) => err)
  }
}

export function signUp(email, password, confirm_password) {
  return async (dispatch) => {
    await fetch('/api/v1/auth/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        confirm_password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: SET_RESPONSE, response: data.message })

        // if (data.status === 'ok') {
        //   dispatch({ type: SET_RESPONSE, response: data.message })
        // } else {
        //   dispatch({ type: SET_RESPONSE, response: data.message })
        // }

        // if (data.status === 'ok') {
        //   dispatch({ type: SET_RESPONSE, response: 'Registration succeed!' })
        //   // history.push('/login')
        // }
        // if (data.status === 'error') {
        //   dispatch({ type: SET_RESPONSE, response: data.message })
        // }
      })
      .catch((err) => err)
  }
}
