import mongoose from 'mongoose'

const channelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamp: true
  }
)

export default mongoose.model('channels', channelSchema)
