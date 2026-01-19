import { useState } from "react";
import { ALL_BOOKS, REMOVE_BOOK } from "../graphql/queries";
import { useQuery, useMutation } from "@apollo/client/react";
import Select from "react-select";

const Books = ({ setError, user }) => {
  const result = useQuery(ALL_BOOKS);
  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
    onError: (error) => setError(error.message),
    onCompleted: (data) =>
      setError(`${data.removeBook.title} was removed from the list`),
  });
  const [selectedGenre, setSelectedGenre] = useState(null);
  const options = [];

  const handleDelete = (id) => {
    removeBook({ variables: { id: id } });
  };

  if (result.loading) {
    return <div>Loading books...</div>;
  }

  if (result.error) {
    return <div>Failed to get the books list</div>;
  }

  for (const book of result.data.allBooks) {
    for (const genre of book.genres) {
      if (!options.some(item => item.value === genre)) {
        options.push({ value: genre, label: genre });
      }
    }
  }

  const booksDisplay = !selectedGenre ? 
    result.data.allBooks : 
    result.data.allBooks.filter((b) => b.genres.includes(selectedGenre.value));

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
            <th>genres</th>
          </tr>
          {booksDisplay.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author?.name ?? "(Removed author)"}</td>
              <td>{b.published}</td>
              <td>{b.genres.join(", ")}</td>
              {user && (
                <td>
                  <button onClick={() => handleDelete(b.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Select
          defaultValue={selectedGenre}
          onChange={setSelectedGenre}
          isClearable={true}
          options={options}
        />
      </div>
    </div>
  );
};

export default Books;
