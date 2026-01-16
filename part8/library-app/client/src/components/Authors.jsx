import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR, REMOVE_AUTHOR } from "../graphql/queries";
import { useQuery, useMutation } from "@apollo/client/react";
import Select from "react-select";

const Authors = ({ setError }) => {
  const [authorName, setAuthorName] = useState(null);
  const [born, setBorn] = useState("");
  const result = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => setError(error.message),
  });
  const [removeAuthor] = useMutation(REMOVE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => setError(error.message),
    onCompleted: (data) =>
      setError(`${data.removeAuthor.name} was removed from the list`),
  });
  const options = [];

  if (result.loading) {
    return <div>Loading authors...</div>;
  }

  if (result.error) {
    return <div>Failed to get the authors list</div>;
  }

  const changeBirthYear = (event) => {
    event.preventDefault();
    editAuthor({ variables: { name: authorName.value, setBornTo: born } });
    setBorn("");
  };

  const handleDelete = (id) => {
    removeAuthor({ variables: { id: id } });
  };

  for (const author of result.data.allAuthors) {
    options.push({ value: author.name, label: author.name });
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
              <td>
                <button onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={changeBirthYear}>
        <div>
          <Select
            defaultValue={authorName}
            onChange={setAuthorName}
            options={options}
          />
        </div>
        <div>
          <label>born</label>
          <input
            type="number"
            value={born}
            onChange={(e) => setBorn(Number(e.target.value))}
          ></input>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
