import { useSelector, useDispatch } from "react-redux";
import { voteFor } from "../reducers/anecdoteReducer";
import {
  showNotification,
  removeNotification,
} from "../reducers/notificationReducer";

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

  const handleVote = (anecdote) => {
    dispatch(voteFor(anecdote));

    // Notify user of successful vote
    const votedContent = anecdotes.find((a) => a.id === anecdote.id).content;
    dispatch(showNotification(`You voted for '${votedContent}'`));
    setTimeout(() => {
      dispatch(removeNotification());
    }, 5000);
  };

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote)}>vote</button>
      </div>
    </div>
  ));
};

export default AnecdoteList;
