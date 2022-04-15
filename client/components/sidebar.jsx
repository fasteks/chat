import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBellSlash } from '@fortawesome/free-regular-svg-icons'

import './sidebar.scss'

const Sidebar = () => {
  const { channels } = useSelector((s) => s.channels)
  const [active, setActive] = useState(null)
  const [bell, setBell] = useState(true)

  return (
    <div className="sidebar flex flex-col">
      <h2 className="sidebar__title flex items-center justify-between">
        Chat
        <button type="button">
          {bell && <FontAwesomeIcon icon={faBell} onClick={() => setBell(!bell)} />}
          {!bell && <FontAwesomeIcon icon={faBellSlash} onClick={() => setBell(!bell)} />}
        </button>
      </h2>
      <h3 className="sidebar__channels flex justify-between items-center">
        Channels
        <button type="button" className="">
          +
        </button>
      </h3>
      {Object.keys(channels).map((el, index) => {
        return (
          <button
            key={el + index}
            type="button"
            className={classnames('sidebar__channel flex flex-col', {
              active: active === el
            })}
            onClick={() => {
              if (active === el) {
                setActive(null)
              }
              if (active !== el) {
                setActive(el)
              }
            }}
          >
            {el}
          </button>
        )
      }) || <span className="hidden">&nbsp;</span>}
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
