import StatisticsLine from "./StatisticsLine";

export default function Statistics({ good, neutral, bad, all, average, percentage }) {
  return (
    <>
      <table>
        <tbody>
          <StatisticsLine text={"good"} value={good}/>
          <StatisticsLine text={"neutral"} value={neutral}/>
          <StatisticsLine text={"bad"} value={bad}/>
          <StatisticsLine text={"all"} value={all}/>
          <StatisticsLine text={"average"} value={average}/>
          <StatisticsLine text={"percentage"} value={percentage}/>
        </tbody>
      </table>
    </>
  );
}