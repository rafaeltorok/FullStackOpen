const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [commentSchema],
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;

    returnedObject.comments = returnedObject.comments.map((c) => {
      c.id = c._id.toString();
      delete c._id;
      return c;
    });
  },
});

module.exports = mongoose.model("Blog", blogSchema);
