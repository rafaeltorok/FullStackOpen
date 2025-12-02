import { voteAnecdote } from '../reducers/anecdoteReducer.js'
import { useDispatch, useSelector } from 'react-redux'

export default function AnecdoteList() {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if (filter === '') {
      return anecdotes
    }
    return anecdotes.filter(a => 
      a.content.toLowerCase().includes(filter.toLowerCase())
    )
  })
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  const vote = id => {
    dispatch(voteAnecdote(id))
  }

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}