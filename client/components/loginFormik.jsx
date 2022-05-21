import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import Head from './head'

import { signIn, updateResponse } from '../redux/reducers/auth'
import { history } from '../redux'

const LoginFormik = () => {
  const dispatch = useDispatch()
  const { response } = useSelector((s) => s.auth)

  // создание полей формы (шаблона)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    // валидация полей формы (данных)
    validationSchema: Yup.object({
      email: Yup.string()
        .min(1, 'Minimum 1 characters')
        .lowercase()
        .matches(/^\w+$/, 'Can only use numbers and Latin letters')
        .required('Required!'),
      password: Yup.string()
        .min(1, 'Minimum 1 characters')
        .max(10, 'Maximum 10 characters')
        .matches(/^\w+$/, 'Can only use numbers and Latin letters')
        .required('Required!')
    }),
    onSubmit: (values) => {
      dispatch(signIn(values.email, values.password))
      setTimeout(() => {
        dispatch(updateResponse(''))
      }, 3000)
    }
  })

  return (
    <>
      <Head title="Login" />
      <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
        <div className="max-w-xs bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <form className="" onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Login
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="text"
                value={formik.values.email}
                placeholder="Account Name"
                onChange={formik.handleChange}
              />
              {/* {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-xs italic">{formik.errors.email}</p>
              ) : (
                <p className="text-red-500 text-xs italic">&nbsp;</p>
              )} */}
              {(formik.touched.email && formik.errors.email) || response ? (
                <p className="text-red-500 text-xs italic">{formik.errors.email || response}</p>
              ) : (
                <p className="text-red-500 text-xs italic">&nbsp;</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="text"
                value={formik.values.password}
                placeholder="Account Password"
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-500 text-xs italic">{formik.errors.password}</p>
              ) : (
                <p className="text-red-500 text-xs italic">&nbsp;</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
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

LoginFormik.propTypes = {}

export default LoginFormik
