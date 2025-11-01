const blogsRouter = require('express').Router()
const { request, response } = require('express')
const Blog = require('../models/blog.js')

blogsRouter.get('/api/blogs', async (request, response, next) => {
  try {
    const data = await Blog.find({})
    response.json(data)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/api/blogs/:id', async (request, response, next) => {
  try {
    const data = await Blog.findById(request.params.id)

    if (data) {
      response.json(data)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/api/blogs', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body

    const newBlog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
    })

    await newBlog.save()
    response.status(201).json(newBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/api/blogs/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const blogToRemove = await Blog.findById(id)

    if (blogToRemove) {
      await Blog.findByIdAndDelete(id)
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/api/blogs/:id', async (request, response, next) => {
  try {
    const likes = request.body.likes

    if (likes === undefined || likes < 0) {
      return response.status(400).json({ error: 'Invalid number of likes' });
    }

     const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true }
    )

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter