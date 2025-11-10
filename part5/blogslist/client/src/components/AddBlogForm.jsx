export default function AddBlogForm({ newBlog, setNewBlog, addBlog }) {
  return (
    <div className="container">
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          ></input>
        </div>
        <div>
          <label htmlFor="author">Author</label>
          <input
            id="author"
            type="text"
            value={newBlog.author}
            onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
          ></input>  
        </div>
        <div>
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="text"
            value={newBlog.url}
            onChange={(e) => setNewBlog({ ...newBlog, url: e.target.value })}
          ></input>
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  )
}