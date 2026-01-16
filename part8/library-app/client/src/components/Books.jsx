import { ALL_BOOKS, REMOVE_BOOK } from "../graphql/queries";
import { useQuery, useMutation } from "@apollo/client/react";

const Books = ({ setError }) => {
  const result = useQuery(ALL_BOOKS);
  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
    onError: (error) => setError(error.message),
    onCompleted: (data) => setError(`${data.removeBook.title} was removed from the list`)
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
              <td>{b.author?.name ?? '(Removed author)'}</td>
              <td>{b.published}</td>
              <td>{b.genres.join(', ')}</td>
              <td>
                <button onClick={() => handleDelete(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
