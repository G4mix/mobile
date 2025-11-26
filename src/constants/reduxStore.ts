import { configureStore } from "@reduxjs/toolkit";
import { feedReducer } from "@/features/feed/feedSlice";
import { userReducer } from "@/features/auth/userSlice";
import { commentsReducer } from "@/features/comments/commentsSlice";
import { profileReducer } from "@/features/profile/profileSlice";
import { notificationsReducer } from "@/features/notifications/notificationsSlice";
import { projectsReducer } from "../features/projects/projectsSlice";

export const reduxStore = configureStore({
  reducer: {
    comments: commentsReducer,
    profile: profileReducer,
    projects: projectsReducer,
    feed: feedReducer,
    user: userReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
