const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const config = require('./utils/config.js')
const { errorHandler } = require('./utils/middleware.js')
const loginRouter = require('./controllers/login.js')

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(errorHandler)

module.exports = app