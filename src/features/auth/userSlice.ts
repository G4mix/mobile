import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id: string;
  displayName: string | null;
  icon?: string | null;
  backgroundImage?: string | null;
  autobiography?: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  links: string[];
  user: {
    id: string;
    username: string;
    email: string;
    verified: boolean;
    created_at: string;
  };
}

const initialState: UserState = {
  id: "",
  displayName: null,
  autobiography: null,
  backgroundImage: null,
  followersCount: 0,
  followingCount: 0,
  links: [],
  icon: null,
  user: {
    id: "",
    username: "",
    created_at: "",
    verified: false,
    email: ""
  }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.displayName = action.payload.displayName;
      state.icon = action.payload.icon;
      state.autobiography = action.payload.autobiography;
      state.followersCount = action.payload.followersCount;
      state.followingCount = action.payload.followingCount;
      state.backgroundImage = action.payload.backgroundImage;
      state.links = action.payload.links;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.id = "";
      state.displayName = null;
      state.icon = null;
      state.autobiography = null;
      state.followersCount = 0;
      state.followingCount = 0;
      state.backgroundImage = null;
      state.links = [];

      state.user = {
        created_at: "",
        id: "",
        email: "",
        username: "",
        verified: false
      };
    }
  }
});

export const { setUser, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
