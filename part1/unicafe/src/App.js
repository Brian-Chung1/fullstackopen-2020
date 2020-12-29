import React, { useState } from "react";
import "./App.css";

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const Statistic = ({ text, value }) => (
  <tr>
    <th>{text}</th>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad, total, avg, pos }) => {
  if (total === 0) return <p>No feedback given</p>;
  return (
    <table>
      <tbody>
        <Statistic text="Good" value={good} />
        <Statistic text="Neutral" value={neutral} />
        <Statistic text="Bad" value={bad} />
        <Statistic text="All" value={total} />
        <Statistic text="Average" value={avg} />
        <Statistic text="Positive" value={pos} />
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const getTotal = () => good + neutral + bad;

  const getAvg = () => {
    const total = getTotal(good, neutral, bad);
    return total === 0 ? 0 : (good - bad) / total;
  };

  const getPos = () => {
    const total = getTotal(good, neutral, bad);
    return total === 0 ? 0 : (good / total) * 100;
  };

  return (
    <>
      <div>
        <h1>Give Feedback</h1>
        <Button handleClick={() => setGood(good + 1)} text="Good" />
        <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
        <Button handleClick={() => setBad(bad + 1)} text="Bad" />
      </div>

      <div>
        <h1>Statistics</h1>
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          total={getTotal()}
          avg={getAvg()}
          pos={getPos()}
        />
      </div>
    </>
  );
};

export default App;
