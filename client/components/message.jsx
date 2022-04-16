import React from 'react'
import ReactMarkdown from 'react-markdown'

import './message.scss'

const Message = ({ message }) => {
  return (
    <div className="message">
      <img className="message__icon" src="../assets/images/such_wow_favicon.ico" alt="user-icon" />
      <div className="message__text information">
        <p className="information__header header">
          <span className="header__name">{message.messageId}</span>
          <span className="header__date">{message.messageDate}</span>
        </p>
        <p className="information__text">
          <ReactMarkdown>{message.messageStr}</ReactMarkdown>
        </p>
      </div>
    </div>
  )
}

Message.propTypes = {}

export default Message
