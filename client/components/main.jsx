import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import './main.scss'

const Main = () => {
  const [rows, setRows] = useState(1)
  const [message, setMessage] = useState('')
  const { channels, currentChannel } = useSelector((s) => s.channels)
  const isChannel = currentChannel.length === 0
  const areChannels = Object.keys(channels)?.length !== 0
  const areMessages = channels[currentChannel]?.messages.length !== 0

  return (
    <div className="main flex flex-col justify-between grow">
      <div className="main__header flex flex-wrap items-center justify-between">
        <div className="header flex flex-col">
          <h3 className="header__title">#general</h3>
          <p className="header__description">Chill chatting about everyting</p>
        </div>
        <div>
          <input type="text" className="header__input" placeholder="Search" />
        </div>
      </div>
      <div className="main__messages flex flex-col grow">
        {isChannel && areChannels && (
          <p className="h-full flex flex-col items-center justify-center">Choose a channel!</p>
        )}
        {isChannel && !areChannels && (
          <p className="h-full flex flex-col items-center justify-center">Make a channel!</p>
        )}
        {!isChannel &&
          areMessages &&
          channels[currentChannel]?.messages.map((it, index) => {
            return <p key={index}>{it}</p>
          })}
        {!isChannel && !areMessages && (
          <p className="h-full flex justify-center items-center">No one sent a message yet!</p>
        )}
      </div>
      <div className="main__message message flex">
        <button type="button" className="message__button bg-white">
          +
        </button>
        <textarea
          type="text-area"
          className="message__input grow resize-none"
          rows={rows}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            if (e.target.value <= 1) {
              setRows(1)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && rows < 4) {
              setRows(+rows + 1)
            }
          }}
          placeholder={`Message to ${'#general'}`}
        />
      </div>
    </div>
  )
}

Main.propTypes = {}

export default Main
