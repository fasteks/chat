import React, { useState } from 'react'

import classnames from 'classnames'

import './sidebar.scss'

const Sidebar = () => {
  const [active, setActive] = useState(false)
  return (
    <div className="sidebar flex flex-col">
      <h2 className="sidebar__title ">Chat</h2>
      <h3 className="sidebar__channels">Channels</h3>
      <button
        type="button"
        className={classnames('sidebar__channel', {
          active
        })}
        onClick={() => {
          setActive(!active)
        }}
      >
        # general
      </button>
      <div className="sidebar__users flex flex-col">
        <h3>Direct Messages</h3>
        <p>fasteks (me)</p>
        <p>Adam</p>
        <p>Olivia</p>
      </div>
      <h3 className="sidebar__applications">Applications</h3>
    </div>
  )
}

Sidebar.propTypes = {}

export default Sidebar
