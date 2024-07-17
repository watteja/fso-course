import { useState } from "react";

const Anecdote = ({ title, text, votes }) => {
  return (
    <div>
      <h1>{title}</h1>
      <div>{text}</div>
      <div>has {votes} votes</div>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  // initialize state for votes with zero-filled array of appropriate length
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length));

  const getRandomAnecdote = () => {
    // ensure randomly selected anecdote is different from the currently displayed one
    let randomIndex = selected;
    let different = false;
    while (!different) {
      randomIndex = Math.floor(Math.random() * anecdotes.length);
      different = randomIndex !== selected;
    }
    setSelected(randomIndex);
  };

  const vote = (voteIndex) => {
    const votesCopy = [...votes];
    votesCopy[voteIndex] += 1;
    setVotes(votesCopy);
  };

  /**
   * Get top voted anecdote index and vote count.
   * In case of ties, the lower array index will be chosen.
   */
  const getTopVotedInfo = () => {
    let max = votes[0];
    let maxIndex = 0;

    for (let i = 1; i < votes.length; i++) {
      if (votes[i] > max) {
        maxIndex = i;
        max = votes[i];
      }
    }

    return [maxIndex, max];
  };
  const [topVotedIndex, topVotes] = getTopVotedInfo();

  return (
    <div>
      <Anecdote
        title="Anecdote of the day"
        text={anecdotes[selected]}
        votes={votes[selected]}
      />
      <button onClick={() => vote(selected)}>vote</button>
      <button onClick={() => getRandomAnecdote()}>next anecdote</button>

      <Anecdote
        title="Anecdote with most votes"
        text={anecdotes[topVotedIndex]}
        votes={topVotes}
      />
    </div>
  );
};

export default App;
