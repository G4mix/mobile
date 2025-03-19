import { env } from "@constants/env";
import * as AuthSession from "expo-auth-session";

export const useGoogleAuth = () =>
  AuthSession.useAuthRequest(
    {
      clientId: env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      redirectUri: `${env.EXPO_PUBLIC_API_URL}/api/v1/auth/callback/google`,
      responseType: "code",
      scopes: ["profile", "email"],
      usePKCE: true,
      extraParams: {
        prompt: "consent",
        access_type: "offline"
      }
    },
    { authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth" }
  );
