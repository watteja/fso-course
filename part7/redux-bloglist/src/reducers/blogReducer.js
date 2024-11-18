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
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
    updateBlog(state, action) {
      // replace updated blog in the state
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      );
    },
  },
});

const { setBlogs, appendBlog, removeBlog, updateBlog } = blogSlice.actions;

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

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id);
    dispatch(removeBlog(id));
  };
};

export const likeBlog = (blogToChange) => {
  return async (dispatch) => {
    const changedBlog = {
      ...blogToChange,
      likes: blogToChange.likes + 1,
      user: blogToChange.user.id,
    };
    const returnedBlog = await blogService.update(changedBlog);

    // persist user info
    returnedBlog.user = JSON.parse(JSON.stringify(blogToChange.user));

    dispatch(updateBlog(returnedBlog));
  };
};

export default blogSlice.reducer;
