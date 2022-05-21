import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Head from './head'

import { updateEmailField, updatePasswordField, signIn } from '../redux/reducers/auth'
import { history } from '../redux'

const LoginForm = () => {
  const dispatch = useDispatch()
  const email = useSelector((s) => s.auth.email)
  const password = useSelector((s) => s.auth.password)
  return (
    <>
      <Head title="Login" />
      <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
        <div className=" max-w-xs ">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Account Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                value={email}
                placeholder="Account Name"
                onChange={(e) => {
                  dispatch(updateEmailField(e.target.value))
                }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
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
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  dispatch(signIn())
                }}
              >
                Sign In
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  dispatch(updateEmailField(''))
                  dispatch(updatePasswordField(''))
                  history.push('/registration')
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

LoginForm.propTypes = {}

export default LoginForm
