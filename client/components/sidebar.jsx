import React from 'react'

import './sidebar.scss'

const Sidebar = () => {
  return (
    <div className="sidebar flex flex-col">
      <h2 className="sidebar__title ">Chat</h2>
      <div className="sidebar__channels flex flex-col">
        <h3>Channels</h3>
        <p># general</p>
      </div>
      <div className="sidebar__users flex flex-col">
        <h3>Direct Messages</h3>
        <p>fasteks (me)</p>
        <p>Adam</p>
        <p>Olivia</p>
      </div>
      <div className="flex flex-col">
        <h3>Applications</h3>
      </div>
    </div>
  )
}

Sidebar.propTypes = {}

export default Sidebar
