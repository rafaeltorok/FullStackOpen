import { useState } from "react"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../graphql/queries"
import { useQuery, useMutation } from '@apollo/client/react'

const Authors = ({ setError }) => {
  const [authorName, setAuthorName] = useState("")
  const [born, setBorn] = useState("")
  const result = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => setError(error.message)
  })

  if (result.loading) {
    return (
      <div>Loading authors...</div>
    )
  }

  if (result.error) {
    return (
      <div>Failed to get the authors list</div>
    )
  }

  const changeBirthYear = (event) => {
    event.preventDefault()
    editAuthor({ variables: { name: authorName, setBornTo: born } })
    setAuthorName("")
    setBorn("")
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={changeBirthYear}>
        <div>
          <label>name</label>
          <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)}></input>
        </div>
        <div>
          <label>born</label>
          <input type="number" value={born} onChange={(e) => setBorn(Number(e.target.value))}></input>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
