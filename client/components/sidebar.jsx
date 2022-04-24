import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBellSlash } from '@fortawesome/free-regular-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import classnames from 'classnames'
import './sidebar.scss'

import { addChannel, channelLogin, channelLogout, switchChannel } from '../redux/reducers/channels'
import { history } from '../redux'

const Sidebar = () => {
  const dispatch = useDispatch()
  const { channels } = useSelector((s) => s.channels)
  const { id, name, isOnline } = useSelector((s) => s.auth.user)
  const [active, setActive] = useState(null)
  const [bell, setBell] = useState(true)
  const [channelsClicked, setchannelsClicked] = useState(false)
  const [channelNew, setChannelNew] = useState('')

  return (
    <div className="sidebar flex flex-col">
      <h2 className="sidebar__title flex items-center justify-between">
        Chat
        <button
          type="button"
          onClick={() => {
            fetch('/api/v1/user-info')
            history.push('/admin')
          }}
        >
          admin
        </button>
        <button type="button">
          {bell && <FontAwesomeIcon icon={faBell} onClick={() => setBell(!bell)} />}
          {!bell && <FontAwesomeIcon icon={faBellSlash} onClick={() => setBell(!bell)} />}
        </button>
      </h2>
      <h3 className="sidebar__user">
        <i className={classnames('status', { 'status--online': isOnline })} />
        {name}
      </h3>
      <h3
        className="sidebar__channels channels"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            // Not triggered when swapping focus between children
            setchannelsClicked(false)
          }
        }}
      >
        {!channelsClicked ? (
          <span className="channels__title">Channels</span>
        ) : (
          <input
            type="text"
            className="channels__input"
            autoFocus
            value={channelNew}
            onChange={(e) => {
              setChannelNew(e.target.value)
            }}
          />
        )}
        {!channelsClicked ? (
          <button
            type="button"
            className="channels__button channels__button--plus"
            onClick={() => {
              setchannelsClicked(true)
            }}
          >
            +
          </button>
        ) : (
          <button
            type="button"
            className="channels__button channels__button--minus"
            onClick={() => {
              setChannelNew('')
              setchannelsClicked(false)
            }}
          >
            +
          </button>
        )}
        {channelsClicked && (
          <button
            type="button"
            className="channels__button channels__button--check"
            onClick={() => {
              setChannelNew('')
              if (channelNew.length > 1 && channelNew.trim() !== '') {
                dispatch(addChannel(channelNew.trim()))
                setchannelsClicked(false)
              }
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        )}
      </h3>
      {Object.keys(channels).map((el, index) => {
        return (
          <button
            key={el + index}
            type="button"
            className={classnames('sidebar__channel', {
              active: active === el
            })}
            onClick={() => {
              if (active === el) {
                dispatch(switchChannel(el, id, channelLogout))
                setActive(null)
              }
              if (active !== el) {
                dispatch(switchChannel(el, id, channelLogin))
                setActive(el)
              }
            }}
          >
            {el}
          </button>
        )
      }) || <span className="hidden">&nbsp;</span>}
      <div className="sidebar__users flex flex-col">
        <h3 className="users__title">Direct Messages</h3>
        <p>Adam</p>
        <p>Olivia</p>
      </div>
      <h3 className="sidebar__applications">Applications</h3>
    </div>
  )
}

Sidebar.propTypes = {}

export default Sidebar
