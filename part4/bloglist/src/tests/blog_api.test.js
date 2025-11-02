const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const Blog = require('../models/blog.js')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Creates and stores a new user into the database
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ 
    username: 'root',
    name: 'root',
    passwordHash 
  })
  const savedUser = await user.save()

  // Stores all initial blogs into the database
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({
      ...blog,
      user: savedUser._id
    }))

  const savedBlogs = await Promise.all(blogObjects.map(blog => blog.save()))

  savedUser.blogs = savedBlogs.map(blog => blog._id)
  await savedUser.save()
})

describe('testing the GET method', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })

  test('blogs have id property instead of _id', async () => {
    const response = await api.get('/api/blogs')
    
    const blog = response.body[0]
    assert(blog.id)
    assert(!blog._id)
  })
})

describe('testing the POST method', () => {
  test('a valid blog can be added ', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]

    const newBlog = {
      title: 'Learning async/await calls',
      author: 'The Teacher',
      url: 'https://asyncawait.com',
      userId: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    assert(titles.includes('Learning async/await calls'))
  })

  test('blog without a title is not added', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]

    const newBlog = {
      author: 'The Blogger',
      url: 'https://blog.com',
      userId: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without an author is not added', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]

    const newBlog = {
      title: 'My Test Blog',
      url: 'https://blog.com',
      userId: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without an url is not added', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]

    const newBlog = {
      title: 'My Test Blog',
      author: 'The Blogger',
      userId: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('if the number of likes has not been set, make sure it defaults to 0 ', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]

    const newBlog = {
      title: 'Learning async/await calls',
      author: 'The Teacher',
      url: 'https://asyncawait.com',
      userId: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.at(-1)
    assert.strictEqual(addedBlog.likes, 0)
  })

  test('blog without an user id is not added', async () => {
    const newBlog = {
      title: 'My Test Blog',
      author: 'The Blogger',
      url: 'http://myblog.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('testing the DELETE method', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(n => n.title)
    assert(!titles.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

describe('testing the PUT method', () => {
  test('the number of likes of a blog can be updated with a valid number', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart.at(0)

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ "likes": 1 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, 1)
  })

  test('updating with invalid likes returns 400', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart.at(0)
    const originalLikes = blogToUpdate.likes

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ "likes": -1 })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, originalLikes)
  })

  test('updating without likes returns 400', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart.at(0)
    const originalLikes = blogToUpdate.likes

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({})
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, originalLikes)
  })
})

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'newusername',
      name: 'New User',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'root',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

// Close connection after ALL tests have finished
after(async () => {
  await mongoose.connection.close()
})