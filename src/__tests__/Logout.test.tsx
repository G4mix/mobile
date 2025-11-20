import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Logout } from "../components/ConfigurationsScreen/Logout";
import { userReducer, setUser, logout } from "../features/auth/userSlice";
import * as storage from "../constants/storage";
import { clearAccessTokenCache } from "../constants/api";

const mockShowConfirmationModal = jest.fn();
const mockDispatch = jest.fn();

jest.mock("../constants/storage", () => ({
  removeItem: jest.fn(),
}));

jest.mock("../constants/api", () => ({
  clearAccessTokenCache: jest.fn(),
}));

jest.mock("../hooks/useConfirmationModal", () => ({
  useConfirmationModal: () => ({
    showConfirmationModal: (...args: any[]) =>
      mockShowConfirmationModal(...args),
  }),
}));

jest.mock("../features/auth/userSlice", () => {
  const actual = jest.requireActual("../features/auth/userSlice");
  return {
    ...actual,
    logout: () => {
      const action = actual.logout();
      mockDispatch(action);
      return action;
    },
  };
});

describe("Logout Component", () => {
  let store: any;
  let queryClient: QueryClient;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    jest.clearAllMocks();
    mockDispatch.mockImplementation((action) => store.dispatch(action));

    store.dispatch(
      setUser({
        id: "1",
        displayName: "Test User",
        user: {
          id: "1",
          username: "testuser",
          email: "test@example.com",
          verified: false,
        },
        followers: 0,
        following: 0,
        links: [],
      }),
    );
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Logout />
        </QueryClientProvider>
      </Provider>,
    );

  it("renderiza o botão de logout", () => {
    const { getByText } = renderComponent();
    expect(getByText("Sair da conta")).toBeTruthy();
  });

  it("mostra modal de confirmação ao clicar", () => {
    const { getByText } = renderComponent();
    const logoutButton = getByText("Sair da conta").parent;

    fireEvent.press(logoutButton!);

    expect(mockShowConfirmationModal).toHaveBeenCalledWith({
      title: "Logout",
      content: "Tem certeza de que deseja sair da sua conta?",
      actionName: "Desconectar",
      handleConfirm: expect.any(Function),
    });
  });

  it("executa logout completamente quando confirmado", async () => {
    const clearSpy = jest.spyOn(queryClient, "clear");
    const { getByText } = renderComponent();
    const logoutButton = getByText("Sair da conta").parent;

    fireEvent.press(logoutButton!);

    const confirmCall = mockShowConfirmationModal.mock.calls[0][0];
    const { handleConfirm } = confirmCall;

    (storage.removeItem as jest.Mock).mockResolvedValue(undefined);

    await handleConfirm();

    await waitFor(() => {
      expect(clearSpy).toHaveBeenCalled();
      expect(clearAccessTokenCache).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(logout());
      expect(storage.removeItem).toHaveBeenCalledWith("user");
      expect(storage.removeItem).toHaveBeenCalledWith("accessToken");
      expect(storage.removeItem).toHaveBeenCalledWith("refreshToken");
      const { router } = require("expo-router");
      expect(router.replace).toHaveBeenCalledWith("/auth/signin");
    });

    const state = store.getState();
    expect(state.user.id).toBe("");
    expect(state.user.user.username).toBe("");

    clearSpy.mockRestore();
  });
});
