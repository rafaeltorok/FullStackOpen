import { useState } from 'react';
import Anecdote from './components/Anecdote';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];

  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const [selected, setSelected] = useState(0);

  const maxVotes = Math.max(...votes);
  const mostVoted = votes.indexOf(maxVotes);

  function handleClick() {
    if (anecdotes.length < 2) return; // Prevents an infinite loop below if the list has only one item

    let random = Math.floor(Math.random() * anecdotes.length);

    // Prevents an anecdote being displayed twice in a row
    while (random === selected) {
      random = Math.floor(Math.random() * anecdotes.length);
    }

    setSelected(random);
  }

  function handleVote() {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  }

  return (
    <div>
      <Anecdote
        anecdote={anecdotes[selected]}
        votes={votes[selected]}
      />
      <button onClick={handleVote}>vote</button>
      <button onClick={handleClick}>next anecdote</button>
      {maxVotes === 0 ? (
        <p>No votes yet</p>
      ) : (
        <Anecdote
          anecdote={anecdotes[mostVoted]}
          votes={votes[mostVoted]}
        />
      )}
    </div>
  );
}

export default App;