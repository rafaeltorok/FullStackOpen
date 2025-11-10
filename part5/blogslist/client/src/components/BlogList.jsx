import Blog from "./Blog"

export default function BlogList({ blogList }) {
  return (
    <div>
      {blogList.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  )
}