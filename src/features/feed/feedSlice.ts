import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tab } from "@/components/ContentTabs";

interface FeedState {
  tab: Tab["key"];
}

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    newIdeas: {
      following: false,
      recommendations: false,
      highlights: false,
    },
    lastFetchTime: new Date().toISOString(),
    actualTab: "recommendations",
  },
  reducers: {
    setNewIdeaIndicator: (state, action: PayloadAction<FeedState>) => {
      state.newIdeas[action.payload.tab] = true;
    },
    clearNewIdeaIndicator: (state, action: PayloadAction<FeedState>) => {
      state.newIdeas[action.payload.tab] = false;
    },
    setActualTab: (state, action) => {
      state.actualTab = action.payload;
    },
    setLastFetchTime: (state, action) => {
      state.lastFetchTime = action.payload;
    },
  },
});

export const {
  setNewIdeaIndicator,
  clearNewIdeaIndicator,
  setLastFetchTime,
  setActualTab,
} = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
