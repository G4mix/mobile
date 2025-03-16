import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useRouter, Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { authEventEmitter } from '@/constants/authEventEmitter';
import { getToken, removeToken } from '@/constants/token';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)/application',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter()
  const pathname = usePathname();

  const checkAuth = async () => {
    const accessToken = await getToken('accessToken');
    const refreshToken = await getToken('refreshToken');

    if (!accessToken || !refreshToken) {
      // setIsAuthenticated(false);
      if (pathname !== '/' && !pathname.startsWith('/auth')) { // Evita loop infinito na tela de login
        router.replace('/'); 
      }
      
      return;
    }

    // setIsAuthenticated(true);
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    const subscription = authEventEmitter.addListener('logout', async () => {
      await removeToken('accessToken');
      await removeToken('refreshToken');
      router.replace('/');
    });

    return () => {
      subscription.removeAllListeners();
    };
    
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="terms" options={{ presentation: 'modal', headerShown: true, title: '' }} />
      </Stack>
    </ThemeProvider>
  );
}
