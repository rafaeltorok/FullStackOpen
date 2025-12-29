import useField from "../hooks/useField"


export default function CreateNew (props) {
  const { reset: resetContent, ...content } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetInfo, ...info } = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
  }

  const handleReset = () => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content-field">content</label>
          <input id="content-field" {...content} />
        </div>
        <div>
          <label htmlFor="author-field">author</label>
          <input id="author-field" {...author} />
        </div>
        <div>
          <label htmlFor="info-field">url for more info</label>
          <input id="info-field" {...info} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}