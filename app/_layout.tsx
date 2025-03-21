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
import { useColorScheme } from "react-native";
import { authEventEmitter } from "@constants/authEventEmitter";
import { getItem, removeItem } from "@constants/storage";
import { ToastProvider } from "@context/ToastContext";
import { reduxStore } from "@constants/reduxStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  // const dispatch = useDispatch();

  const checkAuth = async () => {
    const accessToken = await getItem("accessToken");
    const refreshToken = await getItem("refreshToken");
    // const user = await getItem("user");
    // || !user
    if (!accessToken || !refreshToken) {
      // setIsAuthenticated(false);
      if (
        pathname !== "/" &&
        !pathname.startsWith("/auth") &&
        !["/terms"].includes(pathname)
      ) {
        // Evita loop infinito na tela de login
        router.replace("/");
      }
    }

    // dispatch(setUser(JSON.parse(user)));
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
              name="auth/loading"
              options={{ presentation: "modal", headerShown: false }}
            />
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
  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return <RootLayoutNav />;
}
