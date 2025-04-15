import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tab } from "@/components/ContentTabs";

interface FeedState {
  tab: Tab["key"];
}

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    newPosts: {
      following: false,
      recommendations: false,
      highlights: false
    },
    lastFetchTime: null,
    actualTab: "recommendations"
  },
  reducers: {
    setNewPostIndicator: (state, action: PayloadAction<FeedState>) => {
      state.newPosts[action.payload.tab] = true;
    },
    clearNewPostIndicator: (state, action: PayloadAction<FeedState>) => {
      state.newPosts[action.payload.tab] = false;
    },
    setActualTab: (state, action) => {
      state.actualTab = action.payload;
    },
    setLastFetchTime: (state, action) => {
      state.lastFetchTime = action.payload;
    }
  }
});

export const {
  setNewPostIndicator,
  clearNewPostIndicator,
  setLastFetchTime,
  setActualTab
} = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
