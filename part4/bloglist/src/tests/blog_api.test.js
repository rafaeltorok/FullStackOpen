const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const Blog = require('../models/blog.js')

const api = supertest(app)

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

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const blog of initialBlogs) {
    blogObject = new blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(e => e.content)
  assert.strictEqual(contents.includes('Test blog'), true)
})

after(async () => {
  await mongoose.connection.close()
})