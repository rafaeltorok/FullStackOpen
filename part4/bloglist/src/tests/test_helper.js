const Blog = require('../models/blog.js')
const User = require('../models/user.js')

const initialBlogs = [
  {
    title: "Test blog",
    author: "The Tester",
    url: "https://testingblogs.com",
    likes: 10
  },
  {
    title: "Another blog",
    author: "The Blogger",
    url: "https://anotherblog.com",
    likes: 25
  },
  {
    title: "My blog",
    author: "Myself",
    url: "https://myblog.com",
    likes: 1
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'This blog will be removed soon',
    author: 'Removed author',
    url: 'https://removingsoon.com',
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user', '-blogs')
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({}).populate('blogs', '-user')
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}