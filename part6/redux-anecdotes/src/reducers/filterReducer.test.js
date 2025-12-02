import { describe, test, expect } from 'vitest'
import filterReducer, { filterChange } from './filterReducer'
import deepFreeze from 'deep-freeze'

describe('filterReducer', () => {
  test('returns initial state with unknown action', () => {
    const state = undefined
    const action = { type: 'UNKNOWN' }
    
    const newState = filterReducer(state, action)
    
    expect(newState).toBe('')
  })

  test('filter can be set', () => {
    const state = ''
    const action = filterChange('important')
    
    deepFreeze(state)
    const newState = filterReducer(state, action)
    
    expect(newState).toBe('important')
  })

  test('filter can be changed', () => {
    const state = 'important'
    const action = filterChange('react')
    
    deepFreeze(state)
    const newState = filterReducer(state, action)
    
    expect(newState).toBe('react')
  })

  test('filter can be cleared', () => {
    const state = 'important'
    const action = filterChange('')
    
    deepFreeze(state)
    const newState = filterReducer(state, action)
    
    expect(newState).toBe('')
  })

  test('state remains unchanged with unknown action', () => {
    const state = 'current filter'
    const action = { type: 'UNKNOWN' }
    
    deepFreeze(state)
    const newState = filterReducer(state, action)
    
    expect(newState).toBe('current filter')
  })

  test('filter handles partial matches', () => {
    const state = ''
    const action = filterChange('deb')
    
    deepFreeze(state)
    const newState = filterReducer(state, action)
    
    expect(newState).toBe('deb')
  })
})