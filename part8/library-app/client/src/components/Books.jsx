import { useState } from "react";
import { ALL_BOOKS, REMOVE_BOOK, ALL_AUTHORS } from "../graphql/queries";
import { useQuery, useMutation } from "@apollo/client/react";
import Select from "react-select";

const Books = ({ setError, user }) => {
  const genresList = useQuery(ALL_BOOKS);
  const options = [];
  const [selectedGenre, setSelectedGenre] = useState(null);
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre?.value },
  });
  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => setError(error.message),
    onCompleted: (data) =>
      setError(`${data.removeBook.title} was removed from the list`),
  });

  const handleDelete = (id) => {
    removeBook({ variables: { id: id } });
  };

  if (result.loading) {
    return <div>Loading books...</div>;
  }

  if (result.error) {
    return <div>Failed to get the books list</div>;
  }

  for (const book of genresList.data.allBooks) {
    for (const genre of book.genres) {
      if (!options.some((item) => item.value === genre)) {
        options.push({ value: genre, label: genre });
      }
    }
  }

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
          {result.data.allBooks.map((b) => (
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
