import React from 'react'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from '../redux/reducers/admin'

const Admin = () => {
  const dispatch = useDispatch()
  const { users } = useSelector((s) => s.admin)
  const areUsers = users.length > 0
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col p-5 rounded-xl text-white text-center bg-neutral-800">
        <h1 className="">Admin</h1>
        <p className="">Looks like you found my secret place</p>
        <br />
        <div className="flex justify-center">
          {areUsers ? (
            users.map((it) => {
              return (
                <button
                  className="m-1"
                  type="button"
                  key={it.id}
                  onClick={() => userLogout(it.userObj.email)}
                >
                  {it.userObj.email}
                </button>
              )
            })
          ) : (
            <p>No users online</p>
          )}
        </div>
        {/* <button
          type="button"
          onClick={() => {

          }}
        >
          Display users online
        </button> */}
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
