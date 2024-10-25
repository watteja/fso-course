import { createSlice, current } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    votedAnecdote(state, action) {
      console.log("action", action);
      console.log("state before voting", current(state));
      // replace the old anecdote with the updated one in the state
      const updatedAnecdote = action.payload;
      const newState = state.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      );
      console.log("state after voting", newState);
      return newState;
    },
    setAnecdotes(_state, action) {
      return action.payload;
    },
    appendAnecdote(state, action) {
      return [...state, action.payload];
    },
  },
});

const { votedAnecdote, setAnecdotes, appendAnecdote } = anecdoteSlice.actions;

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

export const voteFor = (anecdote) => {
  return async (dispatch) => {
    const adoteCopy = { ...anecdote };
    adoteCopy.votes += 1;
    await anecdoteService.update(adoteCopy);
    // avoid calling the backend again
    dispatch(votedAnecdote(adoteCopy));
  };
};

export default anecdoteSlice.reducer;
