import { env } from "@/constants/env";
import * as Google from "expo-auth-session/providers/google";

export const useGoogleAuth = () => Google.useAuthRequest({
  androidClientId: env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  clientId: env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
});