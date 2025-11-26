import { createSlice } from "@reduxjs/toolkit";

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    actualTab: "ideas",
  },
  reducers: {
    setActualTab: (state, action) => {
      state.actualTab = action.payload;
    },
  },
});

export const { setActualTab } = projectsSlice.actions;
export const projectsReducer = projectsSlice.reducer;
