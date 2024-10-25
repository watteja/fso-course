import { createSlice, current } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

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

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export default anecdoteSlice.reducer;
