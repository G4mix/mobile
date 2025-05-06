import { configureStore } from "@reduxjs/toolkit";
import { feedReducer } from "@/features/feed/feedSlice";
import { userReducer } from "@/features/auth/userSlice";

export const reduxStore = configureStore({
  reducer: {
    feed: feedReducer,
    user: userReducer
  }
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
