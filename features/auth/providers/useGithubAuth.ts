import { env } from "@constants/env";
import * as AuthSession from "expo-auth-session";

export const useGithubAuth = () =>
  AuthSession.useAuthRequest(
    {
      clientId: env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
      scopes: ["user"],
      redirectUri: `${env.EXPO_PUBLIC_API_URL}/api/v1/auth/callback/github`
    },
    { authorizationEndpoint: "https://github.com/login/oauth/authorize" }
  );
