import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
      // default: this.req.user._id
    },
    userName: {
      type: String,
      required: true
      // default: this.req.user.email
    },
    messageText: {
      type: String,
      required: true,
      default: ''
    },
    messageDate: {
      type: String,
      default: () => new Date()
    },
    meta: {
      default: {}
    }
  },
  {
    timestamp: true
  }
)

export default mongoose.model('messages', messageSchema)
