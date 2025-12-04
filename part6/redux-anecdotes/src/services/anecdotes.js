const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

const createNew = async (content) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  }
  
  const response = await fetch(baseUrl, options)
  
  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }
  
  return await response.json()
}

const update = async (id, updatedAnecdote) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAnecdote)
  })
  if (!response.ok) {
    throw new Error('Failed to update anecdote')
  }
  return await response.json()
}

export default { getAll, createNew, update }