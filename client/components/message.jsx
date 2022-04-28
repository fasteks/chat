import React from 'react'
import ReactMarkdown from 'react-markdown'

import './message.scss'

const Message = ({ message }) => {
  return (
    <div className="messages__message message">
      <img className="message__icon" src="images/such_wow.jpg" alt="user-icon" />
      <div className="message__text information">
        <p className="information__header header">
          <span className="header__name">{message.userName}</span>
          <span className="header__date">{message.messageDate?.slice(4, 21)}</span>
        </p>
        <ReactMarkdown className="information__text">{message.messageText}</ReactMarkdown>
      </div>
    </div>
  )
}

Message.propTypes = {}

export default Message
