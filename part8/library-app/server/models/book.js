import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    unique: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  published: {
    type: Number,
    required: false,
    min: [0, "Publishing year cannot be negative"],
    max: [9999, "Cannot exceed a four digit year number"],
  },
  genres: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v?.length > 0 && v.every((genre) => genre.trim().length >= 3);
      },
      message: "A book must have at least one genre",
    },
  },
});

export default mongoose.model("Book", schema);
