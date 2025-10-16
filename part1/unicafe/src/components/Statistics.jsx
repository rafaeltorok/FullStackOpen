export default function Statistics({ good, neutral, bad, all, average, percentage }) {
  return (
    <>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {all}</p>
      <p>average {average}</p>
      <p>percentage {percentage} %</p>
    </>
  );
}