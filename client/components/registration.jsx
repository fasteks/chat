import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { history } from '../redux'

import {
  updateEmailField,
  updatePasswordField,
  updateConfirmPassword,
  signUp
} from '../redux/reducers/auth'

import Head from './head'

const RegistrationForm = () => {
  const dispatch = useDispatch()
  const email = useSelector((s) => s.auth.email)
  const password = useSelector((s) => s.auth.password)
  const confirmPassword = useSelector((s) => s.auth.confirmPassword)

  return (
    <>
      <Head title="Registration" />
      <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
        <div className=" max-w-xs ">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Enter Email:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                value={email}
                placeholder="Email"
                onChange={(e) => {
                  dispatch(updateEmailField(e.target.value))
                }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Enter Password:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="text"
                value={password}
                placeholder="******************"
                onChange={(e) => {
                  dispatch(updatePasswordField(e.target.value))
                }}
              />
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type="text"
                value={confirmPassword}
                placeholder="******************"
                onChange={(e) => {
                  dispatch(updateConfirmPassword(e.target.value))
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  if (password === confirmPassword) {
                    dispatch(signUp(email, password, confirmPassword))
                  }
                }}
              >
                Register
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  dispatch(updateEmailField(''))
                  dispatch(updatePasswordField(''))
                  dispatch(updateConfirmPassword(''))
                  history.push('/login')
                }}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

RegistrationForm.propTypes = {}

export default RegistrationForm
