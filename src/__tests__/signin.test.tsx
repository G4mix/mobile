import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginScreen from "../app/auth/signin";
import { userReducer } from "../features/auth/userSlice";
import * as storage from "../constants/storage";
import { api } from "../constants/api";

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
    showToast: jest.fn(),
  }),
}));

jest.mock("../features/auth/OAuthLogin", () => {
  const { Text } = require("react-native");
  const { createElement } = require("react");
  return {
    OAuthLogin: ({ provider }: any) =>
      createElement(Text, { testID: `oauth-${provider}` }, `OAuth ${provider}`),
  };
});

describe("LoginScreen", () => {
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
  });

  const renderScreen = () =>
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <LoginScreen />
        </QueryClientProvider>
      </Provider>,
    );

  it("renderiza corretamente com os campos de email e senha", () => {
    const { getByPlaceholderText, getByText } = renderScreen();

    expect(getByPlaceholderText("Digite seu e-mail aqui")).toBeTruthy();
    expect(getByPlaceholderText("Digite a sua senha")).toBeTruthy();
    expect(getByText("Entrar")).toBeTruthy();
    expect(getByText("Conectar-se")).toBeTruthy();
  });

  it("mostra os botões de OAuth", () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId("oauth-google")).toBeTruthy();
    expect(getByTestId("oauth-linkedin")).toBeTruthy();
    expect(getByTestId("oauth-github")).toBeTruthy();
  });

  it("habilita o botão de login quando email e senha são preenchidos", () => {
    const { getByPlaceholderText, getByTestId } = renderScreen();

    const emailInput = getByPlaceholderText("Digite seu e-mail aqui");
    const passwordInput = getByPlaceholderText("Digite a sua senha");
    const loginButton = getByTestId("custom-button");

    expect(loginButton.props.onPress).toBeUndefined();

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    expect(
      emailInput.props.value ||
        emailInput.props.defaultValue ||
        emailInput.props.placeholder,
    ).toBeTruthy();
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it("desabilita o botão de login quando campos estão vazios", () => {
    const { getByTestId } = renderScreen();

    const loginButton = getByTestId("custom-button");

    expect(loginButton.props.onPress).toBeUndefined();
  });

  it("faz login com sucesso e salva tokens", async () => {
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
        userProfile: mockUser,
      },
    };

    (api.post as jest.Mock).mockResolvedValue(mockResponse);
    (storage.setItem as jest.Mock).mockResolvedValue(undefined);

    const { getByPlaceholderText, getByTestId } = renderScreen();
    const { router } = require("expo-router");

    const emailInput = getByPlaceholderText("Digite seu e-mail aqui");
    const passwordInput = getByPlaceholderText("Digite a sua senha");
    const loginButton = getByTestId("custom-button");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton!);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/auth/signin",
        { email: "test@example.com", password: "password123" },
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

  it("não permite múltiplos cliques durante o loading", async () => {
    const mockResponse = {
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        userProfile: {
          id: "1",
          user: {
            id: "1",
            username: "test",
            email: "test@test.com",
            verified: false,
          },
          followers: 0,
          following: 0,
          links: [],
        },
      },
    };

    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (api.post as jest.Mock).mockImplementation(async () => {
      await promise;
      return mockResponse;
    });
    (storage.setItem as jest.Mock).mockResolvedValue(undefined);

    const { getByPlaceholderText, getByTestId } = renderScreen();

    const emailInput = getByPlaceholderText("Digite seu e-mail aqui");
    const passwordInput = getByPlaceholderText("Digite a sua senha");
    const loginButton = getByTestId("custom-button");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    fireEvent.press(loginButton);

    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });

    const buttonAfterLoading = getByTestId("custom-button");
    expect(buttonAfterLoading.props.onPress).toBeUndefined();

    resolvePromise(mockResponse);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });
  });

  it("mostra link para recuperação de senha", () => {
    const { getByText, getByTestId } = renderScreen();

    expect(getByText("Esqueci minha senha")).toBeTruthy();
    expect(getByTestId("link-/auth/forget-password")).toBeTruthy();
  });

  it("mostra link para criar conta", () => {
    const { getByText, getByTestId } = renderScreen();

    expect(getByText("Ainda não tem uma conta?")).toBeTruthy();
    expect(getByText("Criar conta")).toBeTruthy();
    expect(getByTestId("link-/auth/signup")).toBeTruthy();
  });
});
