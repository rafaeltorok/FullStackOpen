const errorHandler = (err, req, res, next) => {
  console.error(err); // Log on the server for debugging

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'duplicate key' });
  }

  res.status(500).json({ error: 'internal server error' });
};

module.exports = { errorHandler }