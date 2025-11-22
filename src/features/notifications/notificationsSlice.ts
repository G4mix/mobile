import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationDto {
  id: string;
  type: "Invite" | "Comment" | "Like" | "Follow";
  title: string;
  message: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
  actorProfileId: string | null;
  actorProfile: {
    id: string;
    displayName: string;
    icon?: string | null;
    autobiography?: string | null;
    backgroundImage?: string | null;
    links: string[];
    followers: number;
    following: number;
    isFollowing: boolean;
    user: {
      id: string;
      email: string;
      username: string;
      verified: boolean;
    } | null;
  } | null;
  relatedEntityId: string | null;
  relatedEntityType:
    | "COLLABORATION_REQUEST"
    | "IDEA"
    | "COMMENT"
    | "PROJECT"
    | null;
  ideaId?: string;
  ideaTitle?: string;
  requesterId?: string;
}

interface NotificationsState {
  notifications: NotificationDto[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  hasMore: true,
  currentPage: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationDto[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<NotificationDto>) => {
      const exists = state.notifications.some(
        (n) => n.id === action.payload.id,
      );
      if (!exists) {
        state.notifications.unshift(action.payload);
        if (!action.payload.read) {
          state.unreadCount += 1;
        }
      }
    },
    appendNotifications: (state, action: PayloadAction<NotificationDto[]>) => {
      const newNotifications = action.payload.filter(
        (newNotif) => !state.notifications.some((n) => n.id === newNotif.id),
      );
      state.notifications = [...state.notifications, ...newNotifications];
    },
    markAsRead: (state, action: PayloadAction<string[]>) => {
      const ids = action.payload;
      state.notifications = state.notifications.map((notif) => {
        if (ids.includes(notif.id) && !notif.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
          return {
            ...notif,
            read: true,
            readAt: new Date().toISOString(),
          };
        }
        return notif;
      });
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.isLoading = false;
      state.hasMore = true;
      state.currentPage = 0;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  appendNotifications,
  markAsRead,
  setUnreadCount,
  incrementUnreadCount,
  setLoading,
  setHasMore,
  setCurrentPage,
  resetNotifications,
} = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;
