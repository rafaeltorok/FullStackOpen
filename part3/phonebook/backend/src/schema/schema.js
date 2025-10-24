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
    required: true,
    trim: true,
    minLength: [6, 'Numbers must be at least 6 chars long']
  }
});
