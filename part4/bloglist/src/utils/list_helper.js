const _ = require('lodash')

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const getFavorite = () => {
    let favorite = { likes: 0 }

    for (const blog of blogs) {
      if (blog.likes > favorite.likes) {
        favorite = blog;
      }
    }

    return favorite
  }

  return blogs.length === 0
    ? "No blogs are present on the list"
    : getFavorite(blogs)
}

const mostBlogs = (blogs) => {
  const getMostBlogs = () => {
    const authorCounts = _.countBy(blogs, 'author')
    const countsArray = Object.entries(authorCounts)
    const [topAuthor, maxCount] = _.maxBy(countsArray, ([, count]) => count)

    return {
      author: topAuthor,
      blogs: maxCount
    }
  }
  
  return blogs.length === 0
    ? "No blogs are present on the list"
    : getMostBlogs(blogs)
}

const mostLikes = (blogs) => {
  const getMostLikes = () => {
    const authorLikes = {};

    for (const blog of blogs) {
      const author = blog.author;
      const likes = blog.likes;

      if (author in authorLikes) {
        authorLikes[author] += likes;
      } else {
        authorLikes[author] = likes;
      }
    }

    const likesArray = Object.entries(authorLikes)
    const [topLikes, maxCount] = _.maxBy(likesArray, ([, count]) => count)

    return {
      author: topLikes,
      likes: maxCount
    }
  }
  
  return blogs.length === 0
    ? "No blogs are present on the list"
    : getMostLikes(blogs)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}