import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    lastFetchTime: new Date().toISOString(),
    actualTab: "posts"
  },
  reducers: {
    setActualTab: (state, action) => {
      state.actualTab = action.payload;
    },
    setLastFetchTime: (state, action) => {
      state.lastFetchTime = action.payload;
    }
  }
});

export const { setLastFetchTime, setActualTab } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
