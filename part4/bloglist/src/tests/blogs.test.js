const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when multiple blogs are present, give the correct sum for all likes', () => {
    const blogs = [
      {
        title: "My personal blog",
        author: "Myself",
        url: "https://myblog.com",
        likes: 9,
      },
      {
        title: "Learning FullStack development",
        author: "The Programmer",
        url: "https://learnfullstack.com",
        likes: 5,
      }
    ]

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 14)
  })
})

describe('favorite blog', () => {
  test('the favoriteBlog function correctly returns the most liked blog', () => {
    const blogs = [
      {
        title: "My personal blog",
        author: "Myself",
        url: "https://myblog.com",
        likes: 9,
      },
      {
        title: "Learning FullStack development",
        author: "The Programmer",
        url: "https://learnfullstack.com",
        likes: 15,
      }
    ]

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[1])
  })

  test('when there are no blogs on the list, return a warning message instead', () => {
    const blogs = []

    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, "No blogs are present on the list")
  })
  
  test('when the favorite blog is a tie, return any of them', () => {
    const blogs = [
      {
        title: "My personal blog",
        author: "Myself",
        url: "https://myblog.com",
        likes: 10,
      },
      {
        title: "Learning FullStack development",
        author: "The Programmer",
        url: "https://learnfullstack.com",
        likes: 10,
      },
      {
        title: "Another blog",
        author: "The Blogger",
        url: "https://anotherblog.com",
        likes: 5,
      }
    ]

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[0])
  })
})