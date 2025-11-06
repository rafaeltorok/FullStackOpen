const jwt = require('jsonwebtoken')
require('dotenv').config()

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const decodedToken = request => {
  const token = getTokenFrom(request)
  return jwt.verify(token, process.env.SECRET)
}

module.exports = { decodedToken }