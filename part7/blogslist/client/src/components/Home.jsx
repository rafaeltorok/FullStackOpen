import AddBlogForm from "./AddBlogForm";
import BlogList from "./BlogList";
import Togglable from "./Togglable";

export default function Home({ blogFormRef, addBlog, blogs }) {
  return (
    <div>
      <Togglable buttonLabel="Add blog" ref={blogFormRef}>
        <AddBlogForm addBlog={addBlog} />
      </Togglable>
      <BlogList blogList={blogs.data} />
    </div>
  );
}
