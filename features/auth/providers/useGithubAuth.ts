import * as AuthSession from "expo-auth-session";

export const useGithubAuth = ({ redirectUri }: { redirectUri: string }) =>
  AuthSession.useAuthRequest(
    {
      clientId: "SEU_CLIENT_ID_GITHUB",
      scopes: ["read:user"],
      redirectUri
    },
    { authorizationEndpoint: "https://github.com/login/oauth/authorize" }
  );
