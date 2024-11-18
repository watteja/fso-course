import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(_state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      return [...state, action.payload];
    },
  },
});

const { setBlogs, appendBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (newBlog, user) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.create(newBlog);
    // MongoDB's insert method returns just the user id, not the whole object
    returnedBlog.user = user;
    dispatch(appendBlog(returnedBlog));
  };
};

export default blogSlice.reducer;
