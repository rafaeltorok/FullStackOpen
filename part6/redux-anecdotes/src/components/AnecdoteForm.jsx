import { createAnecdote } from '../reducers/anecdoteReducer.js'
import { useDispatch } from "react-redux"
import { setNotification, clearNotification } from '../reducers/notificationReducer.js'
import anecdoteService from '../services/anecdotes.js'

export default function AnecdoteForm() {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
    dispatch(setNotification(`you created '${content}'`))

    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
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