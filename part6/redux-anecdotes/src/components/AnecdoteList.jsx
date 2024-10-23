import { useSelector, useDispatch } from "react-redux";
import { voteFor } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => {
    // Filter the anecdotes based on the filter input, case-insensitive
    const filtered = state.anecdotes.filter((a) =>
      a.content.toLowerCase().includes(state.filter.toLowerCase())
    );

    // Sort the anecdotes by the number of votes they have
    return filtered.sort((a, b) => b.votes - a.votes);
  });
  const dispatch = useDispatch();

  const vote = (id) => {
    console.log("vote", id);
    dispatch(voteFor(id));
  };

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => vote(anecdote.id)}>vote</button>
      </div>
    </div>
  ));
};

export default AnecdoteList;
