import { useDispatch } from "react-redux"
import { appendAnecdote } from "../reducers/anecdoteReducer.js"

export default function AnecdoteForm() {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(appendAnecdote(content))
  }

  return (
    <form onSubmit={addAnecdote}>
      <div>
        <input name='anecdote' />
      </div>
      <button type='submit'>create</button>
    </form>
  )
}