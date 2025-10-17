import { createSlice } from "@reduxjs/toolkit";

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    lastFetchTime: new Date().toISOString(),
  },
  reducers: {
    setLastFetchTime: (state, action) => {
      state.lastFetchTime = action.payload;
    },
  },
});

export const { setLastFetchTime } = commentsSlice.actions;
export const commentsReducer = commentsSlice.reducer;
