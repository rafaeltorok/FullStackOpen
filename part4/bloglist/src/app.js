const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs.js')
const config = require('./utils/config.js')
const { errorHandler } = require('./utils/middleware.js')

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use('/', blogsRouter)
app.use(errorHandler)

module.exports = app