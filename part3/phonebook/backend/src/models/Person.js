import mongoose from 'mongoose';
import { personSchema } from '../schema/schema.js';

export const Person = mongoose.model('Person', personSchema, 'contacts');