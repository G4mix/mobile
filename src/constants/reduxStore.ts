import { configureStore } from "@reduxjs/toolkit";
import { feedReducer } from "@/features/feed/feedSlice";
import { userReducer } from "@/features/auth/userSlice";
import { commentsReducer } from "@/features/comments/commentsSlice";
import { profileReducer } from "@/features/profile/profileSlice";

export const reduxStore = configureStore({
  reducer: {
    comments: commentsReducer,
    profile: profileReducer,
    feed: feedReducer,
    user: userReducer
  }
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
