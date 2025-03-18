import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useRouter, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { Provider } from "react-redux";
import { useColorScheme } from "@hooks/useColorScheme";
import { authEventEmitter } from "@constants/authEventEmitter";
import { getItem, removeItem } from "@constants/storage";
import { ToastProvider } from "@context/ToastContext";
import { reduxStore } from "@constants/reduxStore";

// eslint-disable-next-line camelcase
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "application"
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true
});

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    const accessToken = await getItem("accessToken");
    const refreshToken = await getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      // setIsAuthenticated(false);
      if (pathname !== "/" && !pathname.startsWith("/auth")) {
        // Evita loop infinito na tela de login
        router.replace("/");
      }
    }

    // setIsAuthenticated(true);
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    const subscription = authEventEmitter.addListener("logout", async () => {
      await removeItem("accessToken");
      await removeItem("refreshToken");
      router.replace("/");
    });

    return () => {
      subscription.removeAllListeners();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ToastProvider>
        <Provider store={reduxStore}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="application" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            <Stack.Screen
              name="terms"
              options={{ presentation: "modal", headerShown: true, title: "" }}
            />
          </Stack>
        </Provider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}
