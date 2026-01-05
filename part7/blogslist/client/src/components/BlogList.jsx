import { Link } from "react-router-dom";

export default function BlogList({ blogList }) {
  const sortedBlogs = [...blogList].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <ul className="blogs-list">
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link 
              to={`/blogs/${blog.id}`}
            >{blog.title} {blog.author}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
