import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: this.req.user._id
    },
    messageText: {
      type: String,
      required: true,
      default: ''
    },
    messageDate: {
      type: String,
      required: true,
      default: JSON.stringify(new Date())
    },
    meta: {
      required: true,
      default: {}
    }
  },
  {
    timestamp: true
  }
)

export default mongoose.model('channels', messageSchema)
