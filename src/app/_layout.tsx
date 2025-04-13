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
import { useFonts } from "expo-font";
import { ToastProvider } from "@/context/ToastContext";
import { reduxStore } from "@/constants/reduxStore";
import { useMiddleware } from "@/hooks/useMiddleware";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { checkAuth, defineListeners, pathname } = useMiddleware();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => defineListeners(), []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="posts/[postId]"
            options={{ presentation: "modal", headerShown: true, title: "" }}
          />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="auth/loading"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="terms"
            options={{ presentation: "modal", headerShown: true, title: "" }}
          />
        </Stack>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    heroicons: require("../assets/heroicons/heroicons.ttf"),
    roboto: require("../assets/fonts/roboto.ttf")
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={reduxStore}>
      <RootLayoutNav />
    </Provider>
  );
}
