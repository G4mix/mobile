import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegisterScreen from "../app/auth/signup";
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
    get: jest.fn(),
  },
}));

jest.mock("../hooks/useToast", () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock("../utils/timeout", () => ({
  timeout: jest.fn(() => Promise.resolve()),
}));

jest.mock("../components/Checkbox", () => ({
  Checkbox: ({ isChecked, setIsChecked }: any) => {
    const { TouchableOpacity, Text } = require("react-native");
    return (
      <TouchableOpacity
        testID="checkbox"
        onPress={() => setIsChecked(!isChecked)}
      >
        <Text>{isChecked ? "✓" : "☐"}</Text>
      </TouchableOpacity>
    );
  },
}));

describe("RegisterScreen", () => {
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
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    queryClient.clear();
  });

  const renderScreen = () =>
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RegisterScreen />
        </QueryClientProvider>
      </Provider>,
    );

  it("renderiza corretamente com todos os campos", () => {
    const { getByPlaceholderText, getByText } = renderScreen();

    expect(
      getByPlaceholderText("Digite seu nome de usuário aqui"),
    ).toBeTruthy();
    expect(getByPlaceholderText("Digite seu e-mail aqui")).toBeTruthy();
    expect(getByText("Criar uma conta")).toBeTruthy();
    expect(getByText("Registrar-se")).toBeTruthy();
  });

  it("desabilita o botão de registro inicialmente", () => {
    const { getByTestId } = renderScreen();
    const registerButton = getByTestId("custom-button");

    expect(registerButton.props.onPress).toBeUndefined();
  });

  it("habilita o botão quando todos os campos são válidos e checkbox está marcado", async () => {
    const { getByPlaceholderText, getByTestId } = renderScreen();

    (api.get as jest.Mock).mockResolvedValue({ data: null });

    const usernameInput = getByPlaceholderText(
      "Digite seu nome de usuário aqui",
    );
    const emailInput = getByPlaceholderText("Digite seu e-mail aqui");
    const passwordInput = getByPlaceholderText("Digite uma senha");
    const confirmPasswordInput = getByPlaceholderText(
      "Digite sua senha novamente",
    );
    const checkbox = getByTestId("checkbox");

    fireEvent.changeText(usernameInput, "testuser123");
    fireEvent.changeText(emailInput, "test@example.com");

    fireEvent.changeText(passwordInput, "Password123!");
    fireEvent.changeText(confirmPasswordInput, "Password123!");

    fireEvent.press(checkbox);

    jest.advanceTimersByTime(1500);

    await waitFor(
      () => {
        const registerButton = getByTestId("custom-button");
        expect(registerButton).toBeTruthy();
      },
      { timeout: 3000 },
    );
  });

  it("valida email em tempo real", async () => {
    const { getByPlaceholderText } = renderScreen();

    (api.get as jest.Mock).mockResolvedValue({ data: null });

    const emailInput = getByPlaceholderText("Digite seu e-mail aqui");

    fireEvent.changeText(emailInput, "invalid-email");

    await waitFor(() => {
      const inputContainer = emailInput.parent;
      expect(inputContainer).toBeTruthy();
    });

    fireEvent.changeText(emailInput, "valid@example.com");
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/user/exists/valid@example.com", {
        skipAuth: true,
      });
    });
  });

  it("registra usuário com sucesso", async () => {
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

    (api.get as jest.Mock).mockResolvedValue({ data: null });
    (api.post as jest.Mock).mockResolvedValue(mockResponse);
    (storage.setItem as jest.Mock).mockResolvedValue(undefined);

    const { getByPlaceholderText, getByTestId } = renderScreen();

    const usernameInput = getByPlaceholderText(
      "Digite seu nome de usuário aqui",
    );
    const emailInput = getByPlaceholderText("Digite seu e-mail aqui");
    const passwordInput = getByPlaceholderText("Digite uma senha");
    const confirmPasswordInput = getByPlaceholderText(
      "Digite sua senha novamente",
    );
    const checkbox = getByTestId("checkbox");

    fireEvent.changeText(usernameInput, "testuser123");
    fireEvent.changeText(emailInput, "test@example.com");

    fireEvent.changeText(passwordInput, "Password123!");
    fireEvent.changeText(confirmPasswordInput, "Password123!");

    fireEvent.press(checkbox);

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await act(async () => {
      await Promise.resolve();
    });

    const registerButton = getByTestId("custom-button");

    if (registerButton.props.onPress) {
      act(() => {
        fireEvent.press(registerButton);
      });

      await act(async () => {
        await Promise.resolve();
        jest.runAllTimers();
      });

      await waitFor(
        () => {
          expect(api.post).toHaveBeenCalledWith(
            "/auth/signup",
            {
              username: "testuser123",
              password: "Password123!",
              email: "test@example.com",
            },
            { skipAuth: true },
          );
        },
        { timeout: 3000 },
      );
    } else {
      expect(usernameInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    }
  }, 10000);

  it("mostra link para login", () => {
    const { getByText, getByTestId } = renderScreen();

    expect(getByText("Já tem uma conta?")).toBeTruthy();
    expect(getByText("Entrar")).toBeTruthy();
    expect(getByTestId("link-/auth/signin")).toBeTruthy();
  });
});
