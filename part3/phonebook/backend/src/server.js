import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import phonebookRouter from './controllers/routes.js';

dotenv.config();
const app = express();
const url = process.env.MONGODB_URI;

mongoose.set('strictQuery',false);
mongoose.connect(url);

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(cors());
app.use(express.json());
app.use(express.static('./dist'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use('/', phonebookRouter);

// Middleware for unknown endpoints
app.use((request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
});

// Error-handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'internal server error' });
};
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});