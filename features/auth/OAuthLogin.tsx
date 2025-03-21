import { Image, Pressable, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import googleIcon from "@/assets/images/icons/google.png";
import linkedinIcon from "@/assets/images/icons/linkedin.png";
import githubIcon from "@/assets/images/icons/github.png";
import { Colors } from "@/constants/colors";
import { useOAuth } from "@/hooks/useOAuth";

WebBrowser.maybeCompleteAuthSession();

type OAuthLoginProps = {
  provider: "google" | "github" | "linkedin";
};

export function OAuthLogin({ provider }: OAuthLoginProps) {
  const providers = {
    google: { image: googleIcon },
    linkedin: { image: linkedinIcon },
    github: { image: githubIcon }
  };

  const selectedProvider = providers[provider as keyof typeof providers];
  if (!selectedProvider) return null;

  const handleAuth = useOAuth({ provider });

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
