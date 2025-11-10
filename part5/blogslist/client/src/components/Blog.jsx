export default function Blog({ blog }) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th className="blog-title" colSpan={2}>{blog.title}</th>
          </tr>
        </thead>
        <tbody>
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
            <td>{blog.likes}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}