export default function Anecdote({ anecdote, votes }) {
  return (
    <div>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </div>
  );
}