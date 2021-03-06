import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextareaAutosize from 'react-textarea-autosize'

import { sendMessage } from '../redux/reducers/channels'

import './main.scss'
import Message from './message'

const Main = () => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const { channels, currentChannel } = useSelector((s) => s.channels)
  const isChannel = !currentChannel
  const areChannels = channels?.length !== 0
  const messagesLength = channels.find((it) => it.title === currentChannel)?.messagesList.length
  const areMessages = messagesLength !== 0

  // Сохраняет результат выполнения функций для предотвращения повторных вычислений
  // useCallback возвращает функцию
  // useMemo возвращает объект
  const memoizedMessagesArray = React.useMemo(
    () => channels?.find((it) => it.title === currentChannel)?.messagesList,
    [channels?.find((it) => it.title === currentChannel)?.messagesList]
  )

  useEffect(() => {
    document.querySelector('.main__messages')?.lastChild?.scrollIntoView()
  }, [messagesLength])

  return (
    <div className="main flex flex-col justify-between grow">
      {!isChannel && (
        <div className="main__header flex flex-wrap items-center justify-between">
          <div className="header flex flex-col">
            <h3 className="header__title">{currentChannel}</h3>
            <p className="header__description">Chill chatting about everyting</p>
          </div>
          <div>
            <input
              type="text"
              className="header__input"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
          </div>
        </div>
      )}
      <div className="main__messages messages flex flex-col grow">
        {isChannel && areChannels && <p className="messages__alert">Choose a channel!</p>}
        {isChannel && !areChannels && <p className="messages__alert">Make a channel!</p>}
        {!isChannel &&
          areMessages &&
          // channels
          //   ?.find((it) => it.title === currentChannel)
          //   ?.messagesList.map((it) => {
          memoizedMessagesArray
            .map((it) => {
              return <Message key={it._id} message={it} />
            })
            .filter((it) =>
              search.length !== 0
                ? it.props.message.messageText.toLowerCase().includes(search.toLowerCase()) ||
                  it.props.message.userName.toLowerCase().includes(search.toLowerCase())
                : it
            )}
        {!isChannel && !areMessages && (
          <p className="h-full flex justify-center items-center">No one sent a message yet!</p>
        )}
      </div>
      {!isChannel && (
        <div className="main__message message flex">
          <button
            type="button"
            className="message__button bg-white"
            onClick={() => {
              if (message.length >= 1 && message.trim() !== '') {
                dispatch(sendMessage(currentChannel, message))
                setMessage('')
              }
            }}
          >
            +
          </button>
          <TextareaAutosize
            type="text-area"
            autoFocus
            autoCorrect="on"
            spellCheck="true"
            maxRows={3}
            value={message}
            className="message__input grow"
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                message.length >= 1 &&
                message.trim() !== ''
              ) {
                e.preventDefault()
                dispatch(sendMessage(currentChannel, message))
                setMessage('')
              }
            }}
            onto
            placeholder={`Message to ${currentChannel}`}
          />
        </div>
      )}
    </div>
  )
}

Main.propTypes = {}

export default Main

// my own textarea

// const [rows, setRows] = useState(1)
// const cols = 118
// useEffect(() => {
//   if (message.length === 0) {
//     return setRows(1)
//   }
//   if (message.split('').includes('\n')) {
//     const q = message.split('').filter(it => it === '\n').length >= 3 ? 3 : message.split('').filter(it => it === '\n').length + 1
//     return setRows(q)
//   }
//   if (message.length > (cols * rows) && rows < 3 && message.split('').filter(it => it === '\n').length < 3) {
//     return setRows(rows + 1)
//   }
//   if (message.length <= (cols * (rows - 1)) && rows !== 1 && !message.split('').includes('\n')) {
//     return setRows(rows - 1)
//   }
//   return () => {}
// }, [message])

/* <textarea
            type="text-area"
            autoFocus
            className="message__input grow resize-none"
            rows={rows}
            cols={cols}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && message.length > 1 && message.trim() !== '') {
                dispatch(sendMessage(currentChannel, id, message))
                setMessage('')
              }
            }}
            placeholder={`Message to ${currentChannel}`}
          /> */
