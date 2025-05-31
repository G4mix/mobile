import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id: string;
  username: string;
  email: string;
  verified: boolean;
  created_at: string;
  userProfile: {
    id: string;
    displayName: string | null;
    icon?: string | null;
    backgroundImage?: string | null;
    autobiography?: string | null;
    links: {
      id: string;
      url: string;
      userProfileId: string;
    }[];
  };
}

const initialState: UserState = {
  id: "",
  username: "",
  created_at: "",
  userProfile: {
    id: "",
    displayName: null,
    autobiography: null,
    backgroundImage: null,
    links: [],
    icon: null
  },
  verified: false,
  email: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.created_at = action.payload.created_at;
      state.id = action.payload.id;
      state.userProfile = action.payload.userProfile;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.verified = action.payload.verified;
    },
    logout: (state) => {
      state.created_at = "";
      state.id = "";
      state.userProfile = {
        id: "",
        displayName: null,
        icon: null,
        autobiography: null,
        backgroundImage: null,
        links: []
      };
      state.email = "";
      state.username = "";
      state.verified = false;
    }
  }
});

export const { setUser, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
