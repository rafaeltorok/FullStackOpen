import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  born: {
    type: Number,
    required: false,
    min: [0, 'Publishing year cannot be negative'],
    max: [9999, 'Cannot exceed a four digit year number']
  },
  bookCount: {
    type: Number,
    required: false
  }
})

export default mongoose.model('Author', schema)