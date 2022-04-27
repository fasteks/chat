import axios from 'axios'

const GET_CHANNELS = '@chat/channels/GET_CHANNELS'
export const ADD_CHANNEL = '@chat/channels/ADD_CHANNEL'
const SWITCH_CHANNEL = '@chat/channels/SWITCH_CHANNEL'
const SEND_MESSAGE = '@chat/channels/SEND_MESSAGE'
export const channelLogin = 'login'
export const channelLogout = 'logout'

const initialState = {
  channels: [],
  currentChannel: ''
}

// const initialState = {
//   channels: {
//     news: {
//       users: [],
//       messages: [
//         {
//           userId: 1,
//           messageId: 123,
//           messageText: 'hello',
//           messageTime: 1234235,
//           meta: {}
//         }
//       ]
//     }
//   }
// }

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_CHANNELS: {
      return {
        ...state,
        channels: action.channelsObj
      }
    }
    case ADD_CHANNEL: {
      return {
        ...state,
        channels: action.channelsList
      }
    }
    case SWITCH_CHANNEL: {
      return {
        ...state,
        channels: action.channelsObj,
        currentChannel: action.setChannel
      }
    }
    case SEND_MESSAGE: {
      return {
        ...state,
        channels: action.channelsObj
      }
    }
    default:
      return state
  }
}

export function getChannels() {
  return async (dispatch) => {
    await axios({
      method: 'get',
      url: '/api/v1/channels'
    })
      .then(({ data }) => {
        dispatch({ type: GET_CHANNELS, channelsObj: data })
      })
      .catch((err) => err)
  }
}

export function addChannel(title) {
  // return async (dispatch) => {
  return async () => {
    await axios({
      method: 'post',
      url: '/api/v1/channels',
      data: {
        channelTitle: title
      }
    })
    // .then(({ data }) => {
    //   dispatch({ type: ADD_CHANNEL, channelsObj: data })
    // })
    // .catch((err) => err)
  }
}

export function switchChannel(channel, id, action) {
  return async (dispatch) => {
    await axios({
      method: 'post',
      url: '/api/v1/channel',
      data: {
        channel,
        id,
        action
      }
    })
      .then(({ data }) => {
        return dispatch({
          type: SWITCH_CHANNEL,
          channelsObj: data,
          setChannel: action === channelLogin ? channel : ''
        })
      })
      .catch((err) => err)
  }
}

export function sendMessage(currentChannel, id, message) {
  return async (dispatch) => {
    await axios({
      method: 'post',
      url: '/api/v1/channel/message',
      data: {
        currentChannel,
        id,
        message
      }
    })
      .then(({ data }) => {
        return dispatch({
          type: SEND_MESSAGE,
          channelsObj: data
        })
      })
      .catch((err) => err)
  }
}
