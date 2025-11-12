import { useState } from  'react'

export default function Blog({ blog, handleLikes, handleDelete, user }) {
  const [showDetails, setShowDetails] = useState(false)

  const likeBlog = () => {
    handleLikes(blog)
  }

  const removeBlog = () => {
    const confirmRemoval = confirm(`Are you sure you want to remove the blog "${blog.title}" by ${blog.author} from the list?`)
    if (confirmRemoval) {
      handleDelete(blog)
    }
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
                  {user && (
                    <button onClick={likeBlog}>like</button>
                  )}
                </td>
              </tr>
              <tr>
                <th>User:</th>
                <td>{blog.user?.name}</td>
              </tr>
              {user?.username === blog.user?.username && (
                <tr>
                  <th colSpan={2}>
                    <button
                      type="button"
                      onClick={removeBlog}
                    >delete</button>
                  </th>
                </tr>
              )}
            </>
          )}
          <tr>
            <th colSpan={2}  className="display-details-row">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'hide' : 'show'}
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </>
  )
}