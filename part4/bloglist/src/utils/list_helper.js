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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}