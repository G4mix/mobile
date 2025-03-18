import * as AuthSession from "expo-auth-session";

export const useLinkedinAuth = ({ redirectUri }: { redirectUri: string }) =>
  AuthSession.useAuthRequest(
    {
      clientId: "SEU_CLIENT_ID_LINKEDIN",
      scopes: ["r_liteprofile", "r_emailaddress"],
      redirectUri,
      responseType: "code"
    },
    { authorizationEndpoint: "https://www.linkedin.com/oauth/v2/authorization" }
  );
