import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotification(_state, action) {
      return action.payload;
    },
    clearNotification() {
      return null;
    },
  },
});

const { setNotification, clearNotification } = notificationSlice.actions;

export const showNotification = (message, seconds) => {
  const duration = seconds * 1000;
  return async (dispatch) => {
    dispatch(setNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, duration);
  };
};

export default notificationSlice.reducer;
