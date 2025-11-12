import Blog from './Blog.jsx'

export default function BlogList({ blogList, handleLikes, handleDelete, user }) {
  const sortedBlogs = [...blogList].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {sortedBlogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLikes={handleLikes}
          handleDelete={handleDelete}
          user={user}
        />
      ))}
    </div>
  )
}