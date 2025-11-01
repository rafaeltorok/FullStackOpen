const Blog = require('../models/blog')

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
    url: 'https://removingsoon.com'
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}