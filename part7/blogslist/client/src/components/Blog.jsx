import { useParams } from "react-router-dom";

export default function Blog({ handleLikes, handleDelete, user, blogById }) {
  const { id } = useParams();
  const blog = blogById(id);

  if (!blog) {
    return <h2>Blog not found</h2>;
  }

  const likeBlog = () => {
    handleLikes(blog);
  };

  const removeBlog = () => {
    const confirmRemoval = confirm(
      `Are you sure you want to remove the blog "${blog.title}" by ${blog.author} from the list?`,
    );
    if (confirmRemoval) {
      handleDelete(blog);
    }
  };

  return (
    <>
      <table className="blog">
        <thead>
          <tr>
            <th className="blog-title" colSpan={2}>
              {blog.title} by {blog.author}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>URL:</th>
            <td>
              <a href={`${blog.url}`}>{blog.url}</a>
            </td>
          </tr>
          <tr>
            <th>Likes:</th>
            <td>
              <span className="like-count">{blog.likes}</span>
              {user && (
                <button className="like-button" onClick={likeBlog}>
                  like
                </button>
              )}
            </td>
          </tr>
          <tr>
            <th>Added by:</th>
            <td>{blog.user?.name}</td>
          </tr>
          {user?.username === blog.user?.username && (
            <tr>
              <th colSpan={2}>
                <button type="button" onClick={removeBlog}>
                  delete
                </button>
              </th>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
