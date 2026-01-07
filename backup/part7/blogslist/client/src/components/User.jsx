import { useParams } from "react-router-dom";

export default function User({ userById }) {
  const { id } = useParams();
  const user = userById(id);

  if (!user) {
    return <h2>User not found</h2>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul className="blogs-list">
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
}