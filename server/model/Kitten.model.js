import mongoose from 'mongoose'

const kittenSchema = new mongoose.Schema({
  name: String
})

kittenSchema.method({
  speak() {
    return `${this.name} says meow`
  }
})

export default mongoose.model('Kitten', kittenSchema)
