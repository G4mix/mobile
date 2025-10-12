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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { ToastProvider } from "@/context/ToastContext";
import { reduxStore } from "@/constants/reduxStore";
import { useMiddleware } from "@/hooks/useMiddleware";
import { Header } from "@/components/Header";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const customHeader = (title?: string) =>
  function header(props: NativeStackHeaderProps) {
    return <Header {...props} title={title} />;
  };

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { checkAuth, defineListeners, pathname } = useMiddleware();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => defineListeners(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="ideas/[ideaId]/index"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader("Comentários")
              }}
            />
            <Stack.Screen
              name="ideas/[ideaId]/comments/[commentId]"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader("Respostas")
              }}
            />
            <Stack.Screen
              name="ideas/[ideaId]/images/index"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader()
              }}
            />
            <Stack.Screen
              name="ideas/[ideaId]/images/[imageId]"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader()
              }}
            />
            <Stack.Screen
              name="configurations/index"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader("Configurações")
              }}
            />
            <Stack.Screen
              name="configurations/security"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader("Privacidade e segurança")
              }}
            />
            <Stack.Screen
              name="configurations/account"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader("Informações da conta")
              }}
            />
            <Stack.Screen
              name="configurations/email"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader("Atualize seu E-mail")
              }}
            />
            <Stack.Screen
              name="configurations/username"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader("Atualize seu nome")
              }}
            />
            <Stack.Screen
              name="configurations/password"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader("Atualize sua Senha")
              }}
            />
            <Stack.Screen
              name="configurations/profile/index"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="auth/loading"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen
              name="terms"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader("")
              }}
            />
            <Stack.Screen
              name="privacy-policy"
              options={{
                presentation: "modal",
                headerShown: true,
                header: customHeader("")
              }}
            />
          </Stack>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
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
