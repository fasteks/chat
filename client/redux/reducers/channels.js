import axios from 'axios'

const GET_CHANNELS = '@chat/channel/GET_CHANNELS'
const ADD_CHANNEL = '@chat/channel/ADD_CHANNEL'

const initialState = {
  channels: {}
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
      url: `/api/v1/channels`
    })
      .then(({ data }) => {
        dispatch({ type: GET_CHANNELS, channelsObj: data })
      })
      .catch((err) => err)
  }
}

export function addChannel(title) {
  return async (dispatch) => {
    await axios({
      method: 'post',
      url: `/api/v1/channels`,
      data: {
        title
      }
    })
      .then(({ data }) => {
        dispatch({ type: ADD_CHANNEL, channelsObj: data })
      })
      .catch((err) => err)
  }
}
