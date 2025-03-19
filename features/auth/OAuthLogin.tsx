import { Image, Pressable, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "@constants/colors";
import googleIcon from "@assets/images/icons/google.png";
import linkedinIcon from "@assets/images/icons/linkedin.png";
import githubIcon from "@assets/images/icons/github.png";
import { setItem } from "@constants/storage";
import { useGithubAuth } from "./providers/useGithubAuth";
import { useLinkedinAuth } from "./providers/useLinkedinAuth";
import { useGoogleAuth } from "./providers/useGoogleAuth";

WebBrowser.maybeCompleteAuthSession();

type OAuthLoginProps = {
  provider?: "google" | "github" | "linkedin";
};

export function OAuthLogin({ provider }: OAuthLoginProps) {
  const providers = {
    google: {
      image: googleIcon,
      useProvider: useGoogleAuth
    },
    linkedin: {
      image: linkedinIcon,
      useProvider: useLinkedinAuth
    },
    github: {
      image: githubIcon,
      useProvider: useGithubAuth
    }
  };

  const selectedProvider = providers[provider as keyof typeof providers];
  if (!selectedProvider) return null;

  const authProvider = selectedProvider.useProvider();

  const handleAuth = async () => {
    if (authProvider[0]?.codeVerifier) {
      await setItem("codeVerifier", authProvider[0]?.codeVerifier);
    }
    authProvider[2]();
  };

  return (
    <Pressable onPress={handleAuth}>
      <View
        style={{
          borderRadius: 8,
          borderWidth: 1,
          borderColor: Colors.light.tropicalIndigo,
          padding: 6
        }}
      >
        <Image
          source={selectedProvider.image}
          style={{ width: 32, height: 32 }}
        />
      </View>
    </Pressable>
  );
}
