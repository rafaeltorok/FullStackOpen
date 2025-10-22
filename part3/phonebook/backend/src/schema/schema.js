import mongoose from 'mongoose';

export const personSchema = new mongoose.Schema({
  name: String,
  number: String
});