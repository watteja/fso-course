import { createSlice, current } from "@reduxjs/toolkit";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    voteFor(state, action) {
      console.log("action", action);
      const id = action.payload;
      const targetAnecdote = state.find((a) => a.id === id);
      targetAnecdote.votes += 1; // No need for spread operator, since Immer takes care of immutability
      console.log("state after", current(state));
    },
    createAnecdote(state, action) {
      state.push(action.payload); // Immutable due to Immer
    },
    setAnecdotes(_state, action) {
      return action.payload;
    },
  },
});

export const { voteFor, createAnecdote, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
