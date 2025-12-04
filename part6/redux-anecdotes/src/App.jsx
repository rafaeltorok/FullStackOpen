import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setAnecdotes } from './reducers/anecdoteReducer'
import anecdoteService from './services/anecdotes'

import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      const data = await anecdoteService.getAll()
      dispatch(setAnecdotes(data))
    }
    fetchData()
  }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <h2>create new</h2>
      <AnecdoteForm />
    </div>
  )
}

export default App
