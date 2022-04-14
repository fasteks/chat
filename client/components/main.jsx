import React, { useState } from 'react'

import './main.scss'

const Main = () => {
  const [rows, setRows] = useState(1)
  const [message, setMessage] = useState('')
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
        <p>messages</p>
        <p>messages</p>
        <p>messages</p>
        <p>messages</p>
        <p>messages</p>
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
