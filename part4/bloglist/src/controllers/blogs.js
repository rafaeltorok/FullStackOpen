const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')


blogsRouter.get('/', async (request, response, next) => {
  try {
    const data = await Blog.find({}).populate('user', '-blogs')
    response.json(data)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const data = await Blog.findById(request.params.id).populate('user', '-blogs')

    if (data) {
      response.json(data)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body

    if (request.tokenError) return response.status(401).json({ error: 'token invalid' })
    if (!request.userToken) return response.status(401).json({ error: 'token missing' })

    const user = await User.findById(request.userToken.id)

    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const newBlog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id
    })

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    if (request.tokenError) return response.status(401).json({ error: 'token invalid' })
    if (!request.userToken) return response.status(401).json({ error: 'token missing' })

    const user = await User.findById(request.userToken.id)

    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blogId = request.params.id
    const blogToRemove = await Blog.findById(blogId)

    if (blogToRemove) {
      if (blogToRemove.user.toString() !== user._id.toString()) {
        return response.status(401).json({ error: 'Only the original owner can remove a blog' })
      }

      await Blog.findByIdAndDelete(blogId)
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
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