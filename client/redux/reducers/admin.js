export const UPDATE_USERS = '@chat/admin/UPDATE_USERS'

const initialState = {
  users: []
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_USERS: {
      return {
        ...state,
        users: action.users
      }
    }
    default:
      return state
  }
}

export function updateUsers(users) {
  return { type: UPDATE_USERS, users }
}
