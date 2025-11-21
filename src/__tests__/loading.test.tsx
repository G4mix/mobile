import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { userReducer } from "../features/auth/userSlice";
import * as storage from "../constants/storage";
import { api } from "../constants/api";

// Import após os mocks
import AuthLoadingScreen from "../app/auth/loading";

// Mock das dependências
const mockShowToast = jest.fn();

jest.mock("../constants/storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("../constants/api", () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock("../hooks/useToast", () => ({
  useToast: () => ({
    showToast: (...args: any[]) => mockShowToast(...args),
  }),
}));

describe("AuthLoadingScreen", () => {
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
  });

  afterEach(() => {
    jest.clearAllTimers();
    queryClient.clear();
  });

  const renderScreen = () =>
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthLoadingScreen />
        </QueryClientProvider>
      </Provider>,
    );

  it("renderiza o componente de loading", () => {
    const screen = renderScreen();
    expect(screen).toBeTruthy();
  });

  it("processa login OAuth com sucesso", async () => {
    const mockUser = {
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
    };

    const mockResponse = {
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: mockUser,
      },
    };

    const expoRouter = require("expo-router");
    expoRouter.useLocalSearchParams.mockReturnValue({
      token: "oauth-token",
      provider: "google",
    });
    const { router } = expoRouter;

    (api.post as jest.Mock).mockResolvedValue(mockResponse);
    (storage.setItem as jest.Mock).mockResolvedValue(undefined);

    renderScreen();

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/auth/social-login/google",
        { token: "oauth-token" },
        { skipAuth: true },
      );
      expect(storage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(mockUser),
      );
      expect(storage.setItem).toHaveBeenCalledWith(
        "accessToken",
        "access-token",
      );
      expect(storage.setItem).toHaveBeenCalledWith(
        "refreshToken",
        "refresh-token",
      );
      expect(router.replace).toHaveBeenCalledWith("/feed");
    });
  });

  it("redireciona para signin quando há erro nos parâmetros", async () => {
    const expoRouter = require("expo-router");
    expoRouter.useLocalSearchParams.mockReturnValue({
      error: "Erro ao autenticar",
    });

    renderScreen();

    await waitFor(() => {
      expect(expoRouter.router.replace).toHaveBeenCalledWith("/auth/signin");
      expect(mockShowToast).toHaveBeenCalledWith({
        message: "Erro ao autenticar",
        color: "error",
      });
    });
  });

  it("redireciona para signin quando token ou provider estão ausentes", async () => {
    const expoRouter = require("expo-router");
    expoRouter.useLocalSearchParams.mockReturnValue({
      token: undefined,
      provider: undefined,
    });

    renderScreen();

    await waitFor(() => {
      expect(expoRouter.router.replace).toHaveBeenCalledWith("/auth/signin");
      expect(mockShowToast).toHaveBeenCalledWith({
        message: "WITHOUT_NECESSARY_DATA",
        color: "error",
      });
    });
  });

  it("redireciona para signin quando a requisição falha", async () => {
    const expoRouter = require("expo-router");
    expoRouter.useLocalSearchParams.mockReturnValue({
      token: "oauth-token",
      provider: "google",
    });

    (api.post as jest.Mock).mockResolvedValue({ data: null });

    renderScreen();

    await waitFor(() => {
      expect(expoRouter.router.replace).toHaveBeenCalledWith("/auth/signin");
    });
  });
});
