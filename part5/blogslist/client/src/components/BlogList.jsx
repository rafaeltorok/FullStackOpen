import Blog from "./Blog"

export default function BlogList({ blogList, handleLikes }) {
  const sortedBlogs = [...blogList].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {sortedBlogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLikes={handleLikes}
        />
      ))}
    </div>
  )
}