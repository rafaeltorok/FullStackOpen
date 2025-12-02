import { describe, test, expect } from 'vitest'
import anecdoteReducer, { voteAnecdote, createAnecdote } from './anecdoteReducer'
import deepFreeze from 'deep-freeze'

describe('anecdoteReducer', () => {
  test('returns initial state with unknown action', () => {
    const state = undefined
    const action = { type: 'UNKNOWN' }
    
    const newState = anecdoteReducer(state, action)
    
    expect(newState).toHaveLength(6)
    expect(newState[0]).toHaveProperty('content')
    expect(newState[0]).toHaveProperty('id')
    expect(newState[0]).toHaveProperty('votes')
  })

  test('anecdote can be created', () => {
    const state = []
    const action = createAnecdote('New anecdote')
    
    deepFreeze(state)
    const newState = anecdoteReducer(state, action)
    
    expect(newState).toHaveLength(1)
    expect(newState[0].content).toBe('New anecdote')
    expect(newState[0].votes).toBe(0)
    expect(newState[0].id).toBeDefined()
  })

  test('anecdote is added to the end of the list', () => {
    const state = [
      { content: 'First', id: '1', votes: 0 },
      { content: 'Second', id: '2', votes: 0 }
    ]
    const action = createAnecdote('Third')
    
    deepFreeze(state)
    const newState = anecdoteReducer(state, action)
    
    expect(newState).toHaveLength(3)
    expect(newState[2].content).toBe('Third')
  })

  test('vote increments the votes of correct anecdote', () => {
    const state = [
      { content: 'First', id: '1', votes: 0 },
      { content: 'Second', id: '2', votes: 5 }
    ]
    const action = voteAnecdote('2')
    
    deepFreeze(state)
    const newState = anecdoteReducer(state, action)
    
    expect(newState[1].votes).toBe(6)
    expect(newState[0].votes).toBe(0)
  })

  test('voting does not modify other anecdotes', () => {
    const state = [
      { content: 'First', id: '1', votes: 0 },
      { content: 'Second', id: '2', votes: 5 },
      { content: 'Third', id: '3', votes: 10 }
    ]
    const action = voteAnecdote('2')
    
    deepFreeze(state)
    const newState = anecdoteReducer(state, action)
    
    expect(newState[0]).toEqual(state[0])
    expect(newState[2]).toEqual(state[2])
    expect(newState[1].votes).toBe(6)
  })

  test('state remains unchanged with unknown action', () => {
    const state = [
      { content: 'First', id: '1', votes: 5 }
    ]
    const action = { type: 'UNKNOWN' }
    
    deepFreeze(state)
    const newState = anecdoteReducer(state, action)
    
    expect(newState).toEqual(state)
  })
})