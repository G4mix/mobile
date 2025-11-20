import { configureStore } from "@reduxjs/toolkit";
import {
  userReducer,
  setUser,
  logout,
  UserState,
} from "../features/auth/userSlice";

type RootState = {
  user: UserState;
};

describe("userSlice", () => {
  let store: ReturnType<typeof configureStore<{ user: UserState }>>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
  });

  const mockUser: UserState = {
    id: "1",
    displayName: "Test User",
    icon: "icon-url",
    backgroundImage: "bg-url",
    autobiography: "Test bio",
    followers: 100,
    following: 50,
    isFollowing: false,
    links: ["https://example.com"],
    user: {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      verified: true,
    },
  };

  describe("setUser", () => {
    it("define o usuário no estado inicialmente vazio", () => {
      const initialState = store.getState() as RootState;
      expect(initialState.user.id).toBe("");

      store.dispatch(setUser(mockUser));
      const state = store.getState() as RootState;

      expect(state.user.id).toBe("1");
      expect(state.user.displayName).toBe("Test User");
      expect(state.user.user.username).toBe("testuser");
      expect(state.user.user.email).toBe("test@example.com");
      expect(state.user.user.verified).toBe(true);
      expect(state.user.followers).toBe(100);
      expect(state.user.following).toBe(50);
    });

    it("atualiza o usuário quando já existe um no estado", () => {
      store.dispatch(setUser(mockUser));

      const updatedUser: UserState = {
        ...mockUser,
        displayName: "Updated User",
        followers: 200,
      };

      store.dispatch(setUser(updatedUser));
      const state = store.getState() as RootState;

      expect(state.user.displayName).toBe("Updated User");
      expect(state.user.followers).toBe(200);
      expect(state.user.id).toBe("1");
    });

    it("preserva todos os campos do usuário", () => {
      store.dispatch(setUser(mockUser));
      const state = store.getState() as RootState;

      expect(state.user.icon).toBe("icon-url");
      expect(state.user.backgroundImage).toBe("bg-url");
      expect(state.user.autobiography).toBe("Test bio");
      expect(state.user.links).toEqual(["https://example.com"]);
      expect(state.user.isFollowing).toBe(false);
    });
  });

  describe("logout", () => {
    it("limpa todos os dados do usuário", () => {
      store.dispatch(setUser(mockUser));

      let state = store.getState() as RootState;
      expect(state.user.id).toBe("1");
      expect(state.user.user.username).toBe("testuser");

      store.dispatch(logout());

      state = store.getState() as RootState;
      expect(state.user.id).toBe("");
      expect(state.user.displayName).toBe(null);
      expect(state.user.icon).toBe(null);
      expect(state.user.backgroundImage).toBe(null);
      expect(state.user.autobiography).toBe(null);
      expect(state.user.followers).toBe(0);
      expect(state.user.following).toBe(0);
      expect(state.user.links).toEqual([]);
      expect(state.user.isFollowing).toBe(false);
    });

    it("reseta os dados do usuário para valores iniciais", () => {
      store.dispatch(setUser(mockUser));
      store.dispatch(logout());

      const state = store.getState() as RootState;
      expect(state.user.user.id).toBe("");
      expect(state.user.user.username).toBe("");
      expect(state.user.user.email).toBe("");
      expect(state.user.user.verified).toBe(false);
    });

    it("pode fazer logout mesmo quando não há usuário logado", () => {
      const initialState = store.getState() as RootState;
      expect(initialState.user.id).toBe("");

      store.dispatch(logout());

      const state = store.getState() as RootState;
      expect(state.user.id).toBe("");
      expect(state.user.user.username).toBe("");
    });
  });

  describe("integração setUser e logout", () => {
    it("permite fazer login, logout e login novamente", () => {
      store.dispatch(setUser(mockUser));
      let state = store.getState() as RootState;
      expect(state.user.id).toBe("1");

      store.dispatch(logout());
      state = store.getState() as RootState;
      expect(state.user.id).toBe("");

      const secondUser: UserState = {
        ...mockUser,
        id: "2",
        user: {
          id: "2",
          username: "anotheruser",
          email: "another@example.com",
          verified: false,
        },
      };

      store.dispatch(setUser(secondUser));
      state = store.getState() as RootState;
      expect(state.user.id).toBe("2");
      expect(state.user.user.username).toBe("anotheruser");
    });
  });
});
