import React, { useState } from "react";
import "./App.css";

const App = ({ anecdotes }) => {
  const [selected, setSelected] = useState(0);
  const [vote, setVote] = useState(new Array(anecdotes.length).fill(0));

  const voteAnecdote = () => {
    const copy = [...vote];
    copy[selected] += 1;
    setVote(copy);
    console.log(vote);
  };

  const randomIndex = () => {
    const index = Math.floor(Math.random() * Math.floor(anecdotes.length));
    setSelected(index);
  };
  return (
    <>
      <div>
        {anecdotes[selected]}
        <div>Has {vote[selected]} votes</div>
        <button onClick={voteAnecdote}>Vote</button>
        <button onClick={() => setSelected(randomIndex)}>Next Anecdote</button>
      </div>
      <div>
        <h1>Anecdote with most votes</h1>
        <p>
          {Math.max(...vote) !== 0 &&
            anecdotes[vote.indexOf(Math.max(...vote))]}
        </p>
        {Math.max(...vote) !== 0 && <p>Has {Math.max(...vote)} votes</p>}
      </div>
    </>
  );
};

export default App;
