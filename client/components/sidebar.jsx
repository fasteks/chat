import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBellSlash } from '@fortawesome/free-regular-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import classnames from 'classnames'
import './sidebar.scss'

import { addChannel, SET_CHANNEL, switchChannel } from '../redux/reducers/channels'

const Sidebar = () => {
  const dispatch = useDispatch()
  const { channels, currentChannel } = useSelector((s) => s.channels)
  const { user } = useSelector((s) => s.auth)
  const [active, setActive] = useState(null)
  const [bell, setBell] = useState(true)
  const [channelsClicked, setchannelsClicked] = useState(false)
  const [channelNew, setChannelNew] = useState('')

  return (
    <div className="sidebar flex flex-col">
      <h2 className="sidebar__title flex items-center justify-between">
        Chat
        <button type="button">
          {bell && <FontAwesomeIcon icon={faBell} onClick={() => setBell(!bell)} />}
          {!bell && <FontAwesomeIcon icon={faBellSlash} onClick={() => setBell(!bell)} />}
        </button>
      </h2>
      <h3 className="sidebar__user">
        <i className={classnames('status', { 'status--online': 1 })} />
        {user.email}
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
      {channels.map((channel) => {
        return (
          <button
            key={channel._id}
            type="button"
            className={classnames('sidebar__channel', {
              active: active === channel._id
            })}
            onClick={() => {
              dispatch(switchChannel(channel._id))
              if (active === channel._id) {
                setActive(null)
              }
              if (active !== channel._id) {
                setActive(channel._id)
              }
              dispatch({
                type: SET_CHANNEL,
                currentChannelId: currentChannel === channel.title ? null : channel.title
              })
            }}
          >
            {channel.title}
          </button>
        )
      }) || <span className="hidden">&nbsp;</span>}
      <div className="sidebar__users flex flex-col">
        <h3 className="users__title">Direct Messages</h3>
        <p>Adam</p>
        <p>Olivia</p>
      </div>
      <h3 className="sidebar__applications">Applications</h3>
      {1 && (
        <Link className="mx-auto mt-auto" to="/admin">
          admin pannel
        </Link>
      )}
    </div>
  )
}

Sidebar.propTypes = {}

export default Sidebar
