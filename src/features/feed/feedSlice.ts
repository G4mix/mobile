import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setItem } from "@/constants/storage";

export interface FeedState {
  tab: "recommended" | "following" | "highlights";
}

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    newPosts: {
      recommended: false,
      following: false,
      highlights: false
    },
    lastFetchTime: null
  },
  reducers: {
    setNewPostIndicator: (state, action: PayloadAction<FeedState>) => {
      state.newPosts[action.payload.tab] = true;
    },
    clearNewPostIndicator: (state, action: PayloadAction<FeedState>) => {
      state.newPosts[action.payload.tab] = false;
    },
    setLastFetchTime: (state, action) => {
      state.lastFetchTime = action.payload;
      setItem("lastFetchTime", action.payload);
    },
    loadLastFetchTime: (state, action) => {
      state.lastFetchTime = action.payload;
    }
  }
});

export const {
  setNewPostIndicator,
  clearNewPostIndicator,
  setLastFetchTime,
  loadLastFetchTime
} = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
