const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true , unique: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash

    // Convert blogs ObjectIds to strings
    if (returnedObject.blogs) {
      returnedObject.blogs = returnedObject.blogs.map(blog => blog.toString())
    }
  }
})

module.exports = mongoose.model('User', userSchema)