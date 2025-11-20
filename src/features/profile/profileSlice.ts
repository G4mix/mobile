import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    actualTab: "ideas",
  },
  reducers: {
    setActualTab: (state, action) => {
      state.actualTab = action.payload;
    },
  },
});

export const { setActualTab } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
