import { useState } from 'react';
import Statistics from './components/Statistics';

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + neutral + bad;
  const average = (good - bad) / (all);
  const percentage = (good / all) * 100;

  function handleClick(event) {
    switch (event.target.value) {
      case "good":
        setGood(good + 1);
        break;
      case "neutral":
        setNeutral(neutral + 1);
        break;
      case "bad":
        setBad(bad + 1);
        break;
    }
  }

  return (
    <>
      <h1>Give feedback</h1>
      <div>
        <button onClick={handleClick} value="good">good</button>
        <button onClick={handleClick} value="neutral">neutral</button>
        <button onClick={handleClick} value="bad">bad</button>
      </div>
      <h2>Statistics</h2>
      {all > 0 ? (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          all={all}
          average={average}
          percentage={percentage}
        />
      ) : (
        <p>no feedback was given</p>
      )}
      
    </>
  );
}

export default App;
