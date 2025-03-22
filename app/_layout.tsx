import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { Provider } from "react-redux";
import { useColorScheme } from "react-native";
import { ToastProvider } from "@/context/ToastContext";
import { reduxStore } from "@/constants/reduxStore";
import { Middleware } from "@/components/Middleware";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ToastProvider>
        <Provider store={reduxStore}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="application/create"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="application/feed"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="application/profile"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="application/search"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="application/team"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            <Stack.Screen
              name="auth/loading"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen
              name="terms"
              options={{ presentation: "modal", headerShown: true, title: "" }}
            />
          </Stack>
          <Middleware />
        </Provider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return <RootLayoutNav />;
}
