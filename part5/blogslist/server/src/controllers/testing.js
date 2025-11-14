const router = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

router.post('/reset', async (request, response) => {
  await Promise.all([
    Blog.deleteMany({}),
    User.deleteMany({})
  ])

  response.status(204).end()
})

module.exports = router