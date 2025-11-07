const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
require('dotenv').config()

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err); // Log on the server for debugging

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'duplicate key' });
  }

  if (err.name ===  'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired'
    })
  }

  res.status(500).json({ error: 'internal server error' });
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    req.tokenError = 'missing'
    return next()
  }

  const token = authorization.replace('Bearer ', '')

  try {
    req.userToken = jwt.verify(token, process.env.SECRET)
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    req.tokenError = 'invalid'
  }

  next()
}


const userExtractor = async (req, res, next) => {
  if (!req.userToken || !req.userToken.id) {
    // preserve a prior 'missing' tokenError set by tokenExtractor
    if (!req.tokenError) {
      req.tokenError = 'invalid'
    }
    return next()
  }

  try {
    const user = await User.findById(req.userToken.id)
    if (!user) {
      req.tokenError = 'user not found'
    } else {
      req.user = user
    }
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    if (!req.tokenError) req.tokenError = 'invalid'
  }

  next()
}


module.exports = { errorHandler, tokenExtractor, userExtractor }