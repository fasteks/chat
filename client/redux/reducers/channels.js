const initialState = {
  channels: {
    news: {
      users: [],
      messages: [
        {
          userId: 1,
          messageId: 123,
          messageText: 'hello',
          messageTime: 1234235,
          meta: {}
        }
      ]
    }
  }
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    default:
      return state
  }
}
