import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import Head from './head'

import { signUp, updateResponse } from '../redux/reducers/auth'

const RegistrationForm = () => {
  const dispatch = useDispatch()
  const { response } = useSelector((s) => s.auth)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirm_password: ''
    },
    // валидация полей формы (данных)
    validationSchema: Yup.object({
      email: Yup.string()
        .min(1, 'Minimum 1 characters')
        .lowercase()
        .matches(/^\w+$/, 'Can only use numbers and Latin letters')
        .required('Required'),
      password: Yup.string()
        .min(1, 'Minimum 1 characters')
        .max(10, 'Maximum 10 characters')
        .matches(/^\w+$/, 'Can only use numbers and Latin letters')
        .required('Required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], "Password's not match")
        .required('Required')
    }),
    onSubmit: (values, actions) => {
      dispatch(signUp(values.email, values.password, values.confirm_password))
      actions.resetForm()
      setTimeout(() => {
        dispatch(updateResponse(''))
      }, 3000)
    }
  })

  return (
    <>
      <Head title="Registration" />
      <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
        <div className=" max-w-xs ">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Enter Account Name:
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
              {(formik.touched.email && formik.errors.email) || response ? (
                <p className="text-red-500 text-xs italic">{formik.errors.email || response}</p>
              ) : (
                <p className="invisible text-red-500 text-xs italic">&nbsp;</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Enter Password:
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
                <p className="flex flex-wrap text-red-500 text-xs italic">
                  {formik.errors.password}
                </p>
              ) : (
                <p className="invisible flex flex-wrap text-red-500 text-xs italic">&nbsp;</p>
              )}
              <label
                className="mt-4 block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirm_password"
              >
                Confirm Password:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirm_password"
                name="confirm_password"
                type="text"
                value={formik.values.confirm_password}
                placeholder="Account Password"
                onChange={formik.handleChange}
              />
              {formik.touched.confirm_password && formik.errors.confirm_password ? (
                <p className="text-red-500 text-xs italic">{formik.errors.confirm_password}</p>
              ) : (
                <p className="invisible text-red-500 text-xs italic">&nbsp;</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register
              </button>
              <Link
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                to="/login"
              >
                Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

RegistrationForm.propTypes = {}

export default RegistrationForm
