/* eslint-disable import/no-extraneous-dependencies */
import * as WebBrowser from "expo-web-browser";
import { env } from "@/constants/env";
import { generateCodeChallenge, generateCodeVerifier } from "@/utils/pkce";

type Providers = "google" | "linkedin" | "github";

const getAuthUrl = ({
  provider,
  codeChallenge,
  codeVerifier,
}: {
  provider: Providers;
  codeChallenge?: string;
  codeVerifier?: string;
}) => {
  const providers = {
    github: `https://github.com/login/oauth/authorize?client_id=${env.EXPO_PUBLIC_GITHUB_CLIENT_ID}&scope=user&redirect_uri=https://${env.EXPO_PUBLIC_API_URL}/v1/auth/callback/github`,
    google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.EXPO_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=https://${env.EXPO_PUBLIC_API_URL}/v1/auth/callback/google&response_type=code&scope=profile%20email&prompt=consent&access_type=offline&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${encodeURIComponent(codeVerifier || "")}`,
    linkedin: `https://www.linkedin.com/oauth/v2/authorization?client_id=${env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=https://${env.EXPO_PUBLIC_API_URL}/v1/auth/callback/linkedin&response_type=code&scope=openid,profile,email`,
  };
  return providers[provider];
};

export const useOAuth =
  ({ provider }: { provider: Providers }) =>
  async () => {
    let codeChallenge;
    let codeVerifier;

    if (provider === "google") {
      try {
        codeVerifier = await generateCodeVerifier();
        codeChallenge = await generateCodeChallenge({ codeVerifier });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }

    const authUrl = getAuthUrl({ provider, codeChallenge, codeVerifier });
    if (!authUrl) return;
    await WebBrowser.openAuthSessionAsync(authUrl);
  };
