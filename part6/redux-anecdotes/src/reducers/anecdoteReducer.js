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
    setAnecdotes(_state, action) {
      return action.payload;
    },
    appendAnecdote(state, action) {
      return [...state, action.payload];
    },
  },
});

export const { voteFor, setAnecdotes, appendAnecdote } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export default anecdoteSlice.reducer;
