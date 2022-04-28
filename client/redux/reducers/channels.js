import axios from 'axios'

export const GET_CHANNELS = '@chat/channels/GET_CHANNELS'
export const ADD_CHANNEL = '@chat/channels/ADD_CHANNEL'
export const SWITCH_CHANNEL = '@chat/channels/SWITCH_CHANNEL'
export const SET_CHANNEL = '@chat/channels/SET_CHANNEL'
const SEND_MESSAGE = '@chat/channels/SEND_MESSAGE'
export const channelLogin = 'login'
export const channelLogout = 'logout'

const initialState = {
  channels: [],
  currentChannel: ''
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_CHANNELS: {
      return {
        ...state,
        channels: action.channelsArray
      }
    }
    case ADD_CHANNEL: {
      return {
        ...state,
        channels: action.channelsArray
      }
    }
    case SWITCH_CHANNEL: {
      return {
        ...state,
        channels: action.channelsArray,
        currentChannel: action.destinationChannel
      }
    }
    case SET_CHANNEL: {
      return {
        ...state,
        currentChannel: action.currentChannelId
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
  return (dispatch) => {
    axios({
      method: 'get',
      url: '/api/v1/channels'
    })
      .then(({ data }) => {
        dispatch({ type: GET_CHANNELS, channelsArray: data })
      })
      .catch((err) => err)
  }
}

export function addChannel(title) {
  return () => {
    axios({
      method: 'post',
      url: '/api/v1/channels',
      data: {
        channelTitle: title
      }
    }).catch((err) => err)
  }
}

export function switchChannel(channelId, channelTitle) {
  return (dispatch) => {
    axios({
      method: 'post',
      url: '/api/v1/channel',
      data: {
        channelId,
        channelTitle
      }
    })
      .then(({ data }) => {
        return dispatch({
          type: SWITCH_CHANNEL,
          channelsArray: data.updatedChannels,
          destinationChannel: data.channelTitle
        })
      })
      .catch((err) => err)
  }
}

export function sendMessage(currentChannel, message) {
  return () => {
    axios({
      method: 'post',
      url: '/api/v1/channel/message',
      data: {
        currentChannel,
        message
      }
    }).catch((err) => err)
  }
}
