import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id: string;
  displayName: string | null;
  icon?: string | null;
  backgroundImage?: string | null;
  autobiography?: string | null;
  followers: number;
  following: number;
  isFollowing?: boolean;
  links: string[];
  user: {
    id: string;
    username: string;
    email: string;
    verified: boolean;
  };
}

const initialState: UserState = {
  id: "",
  displayName: null,
  autobiography: null,
  backgroundImage: null,
  followers: 0,
  following: 0,
  links: [],
  icon: null,
  user: {
    id: "",
    username: "",
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
      state.followers = action.payload.followers;
      state.following = action.payload.following;
      state.backgroundImage = action.payload.backgroundImage;
      state.links = action.payload.links;
      state.isFollowing = action.payload.isFollowing;
      state.user = action.payload.user;
    },
    logout: state => {
      state.id = "";
      state.displayName = null;
      state.icon = null;
      state.autobiography = null;
      state.followers = 0;
      state.following = 0;
      state.backgroundImage = null;
      state.links = [];
      state.isFollowing = false;

      state.user = {
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
