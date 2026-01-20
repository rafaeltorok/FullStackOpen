import { ALL_BOOKS } from "../graphql/queries";
import { useQuery } from "@apollo/client/react";

export default function Recommendations({ favoriteGenre }) {
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre }
  });

  if (result.loading) {
    return <div>Loading recommendations...</div>;
  }

  if (result.error) {
    return <div>Failed to get the recommendations list</div>;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>Books in your favorite genre: <strong>{favoriteGenre ?? "none"}</strong></p>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
