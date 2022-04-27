import mongoose from 'mongoose'

const channelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    usersOnChannel: {
      type: Array,
      required: true,
      default: []
    },
    messagesList: {
      type: Array,
      required: true,
      default: []
    }
  },
  {
    timestamp: true
  }
)

export default mongoose.model('channels', channelSchema)
