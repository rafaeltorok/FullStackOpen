import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { setNotification } from './notificationReducer'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(a => a.id === id)
      const changedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const { createAnecdote, voteAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
    dispatch(setNotification(`you created '${content}'`, 5))
  }
}

export const vote = (id) => {
  return async (dispatch, getState) => {
    const anecdote = getState().anecdotes.find(a => a.id === id)
    const updated = await anecdoteService.update(id, {
      ...anecdote,
      votes: anecdote.votes + 1
    })
    dispatch(voteAnecdote(updated.id))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }
}

export default anecdoteSlice.reducer
