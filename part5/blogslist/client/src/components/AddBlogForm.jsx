export default function AddBlogForm({ newBlog, setNewBlog, addBlog }) {
  const handleBlogChange = (event) => {
    setNewBlog({
      title: event.target.value.title,
      author: event.target.value.author,
      url: event.target.value.url,
      likes: 0
    })
    console.log(newBlog)
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={newBlog.title}
          onChange={handleBlogChange}
        ></input>
        <label>Author</label>
        <input
          id="author"
          type="text"
          value={newBlog.author}
          onChange={handleBlogChange}
        ></input>
        <label>URL</label>
        <input
          id="url"
          type="text"
          value={newBlog.url}
          onChange={handleBlogChange}
        ></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}