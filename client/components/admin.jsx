import React from 'react'
import { push } from 'connected-react-router'
import { useDispatch } from 'react-redux'

const Admin = () => {
  const dispatch = useDispatch()
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-5 rounded-xl text-white text-center bg-neutral-800">
        <h1 className="">Admin</h1>
        <p className="">Looks like you found my secret place</p>
        <br />
        <button
          className=""
          type="button"
          tabIndex="0"
          onClick={() => {
            dispatch(push('/chat'))
          }}
        >
          {' '}
          Back to Chat
        </button>
      </div>
    </div>
  )
}

Admin.propTypes = {}

export default Admin
