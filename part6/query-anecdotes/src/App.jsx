import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { getAnecdotes, updateAdote } from "./requests";
import {
  useNotificationValue,
  useNotificationDispatch,
  showNotification,
} from "./NotificationContext";

const App = () => {
  const queryClient = useQueryClient();
  const voteMutation = useMutation({
    mutationFn: updateAdote,
    onSuccess: (updatedAdote) => {
      // unoptimized query
      // queryClient.invalidateQueries("anecdotes"); // shorthand for queryClient.invalidateQueries(["anecdotes"])

      // optimized query
      // second argument can be either an updater function or a new value
      queryClient.setQueryData(["anecdotes"], (oldData) =>
        oldData.map((anecdote) =>
          anecdote.id === updatedAdote.id ? updatedAdote : anecdote
        )
      );
    },
  });

  const notification = useNotificationValue();
  const dispatch = useNotificationDispatch();

  const handleVote = (anecdote) => {
    const updatedAdote = { ...anecdote, votes: anecdote.votes + 1 };
    voteMutation.mutate(updatedAdote);
    showNotification(dispatch, `You voted '${anecdote.content}'`, 5);
  };

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 2,
  });

  if (result.isPending) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      {notification && <Notification />}
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
