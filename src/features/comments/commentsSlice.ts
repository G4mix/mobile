import { createSlice } from "@reduxjs/toolkit";

const commentsSlice = createSlice({
  name: "comments",
  initialState: {},
  reducers: {},
});

export const commentsReducer = commentsSlice.reducer;
