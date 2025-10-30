const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs.js')
const config = require('./utils/config.js')

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use('/', blogsRouter)

module.exports = app