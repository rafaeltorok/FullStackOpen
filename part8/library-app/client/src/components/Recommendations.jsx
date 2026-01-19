import { ALL_BOOKS } from "../graphql/queries";
import { useQuery } from "@apollo/client/react";

export default function Recommendations({ user }) {
  const result = useQuery(ALL_BOOKS);

  if (result.loading) {
    return <div>Loading books...</div>;
  }

  if (result.error) {
    return <div>Failed to get the books list</div>;
  }

  const booksDisplay = result.data.allBooks.filter((b) => b.genres.includes(user?.favoriteGenre));

  return (
    <div>
      <h2>recommendations</h2>
      <p>Books in your favorite genre: <strong>{user?.favoriteGenre}</strong></p>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
