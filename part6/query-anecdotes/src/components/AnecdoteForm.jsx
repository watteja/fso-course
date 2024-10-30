import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests";
import {
  useNotificationDispatch,
  showNotification,
} from "../NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const newAdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAdote) => {
      const adotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], adotes.concat(newAdote));
    },
  });

  const dispatch = useNotificationDispatch();

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAdoteMutation.mutate(content);
    showNotification(dispatch, `You created '${content}'`, 5);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
