import { env } from "@constants/env";
import * as AuthSession from "expo-auth-session";

export const useLinkedinAuth = () =>
  AuthSession.useAuthRequest(
    {
      clientId: env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri: `${env.EXPO_PUBLIC_API_URL}/api/v1/auth/callback/linkedin`,
      responseType: "code"
    },
    { authorizationEndpoint: "https://www.linkedin.com/oauth/v2/authorization" }
  );
