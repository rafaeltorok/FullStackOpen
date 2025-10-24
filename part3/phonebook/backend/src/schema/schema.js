import mongoose from 'mongoose';

export const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: [3, 'Names must be at least 3 chars long']
  },
  number: {
    type: String,
    trim: true,
    minLength: [8, 'Numbers must be at least 8 chars long'],
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
});
