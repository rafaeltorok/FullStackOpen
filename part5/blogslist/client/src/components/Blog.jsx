import { useState } from "react"

export default function Blog({ blog, handleLikes }) {
  const [showDetails, setShowDetails] = useState(false)

  const likeBlog = (event) => {
    event.preventDefault()
    handleLikes(blog)
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th className="blog-title" colSpan={2}>{blog.title}</th>
          </tr>
        </thead>
        <tbody>
          {showDetails && (
            <>
              <tr>
                <th>Author:</th>
                <td>{blog.author}</td>
              </tr>
              <tr>
                <th>URL:</th>
                <td>{blog.url}</td>
              </tr>
              <tr>
                <th>Likes:</th>
                <td>
                  {blog.likes}
                  <button onClick={likeBlog}>like</button>
                </td>
              </tr>
              <tr>
                <th>User:</th>
                <td>{blog.user.name}</td>
              </tr>
            </>
          )}
          <tr>
            <th colSpan={2}>
              <button onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? "hide" : "show"}
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </>
  )
}