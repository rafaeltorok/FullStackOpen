import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import phonebookRouter from './controllers/routes.js';

const app = express();

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