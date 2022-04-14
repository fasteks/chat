import React from 'react'

import './main.scss'

const Main = () => {
  return (
    <div className="main flex flex-col justify-between grow">
      <div className="main__header flex items-center justify-between">
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
        <button type="button" className="message__button">
          +
        </button>
        <input
          type="text"
          className="message__input grow"
          placeholder={`Message to ${'#general'}`}
        />
      </div>
    </div>
  )
}

Main.propTypes = {}

export default Main
