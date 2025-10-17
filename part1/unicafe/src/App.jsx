import { useState } from 'react';
import Statistics from './components/Statistics';
import Button from './components/Button';

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + neutral + bad;
  const average = all > 0 ? ((good - bad) / all).toFixed(1) : 0;
  const percentage = all > 0 ? ((good / all) * 100).toFixed(1) + "%" : "0%";

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
        <Button
          handleClick={handleClick}
          value={"good"}
        />
        <Button
          handleClick={handleClick}
          value={"neutral"}
        />
        <Button
          handleClick={handleClick}
          value={"bad"}
        />
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
        <div>
          <p>no feedback was given</p>
        </div>
      )}
      
    </>
  );
}

export default App;
