import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: () =>
      axios.get("http://localhost:3001/anecdotes").then((res) => res.data),
    retry: 2,
  });

  if (result.isPending) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const handleVote = (anecdote) => {
    console.log("vote");
  };

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
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
