import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "This is example notification",
});

export default notificationSlice.reducer;
