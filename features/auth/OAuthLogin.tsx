import { Image, Pressable, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { useEffect } from "react";
import { Colors } from "@constants/colors";
import googleIcon from "@assets/images/icons/google.png";
import linkedinIcon from "@assets/images/icons/linkedin.png";
import githubIcon from "@assets/images/icons/github.png";
import { useGoogleAuth } from "./providers/useGoogleAuth";
import { useLinkedinAuth } from "./providers/useLinkedinAuth";
import { useGithubAuth } from "./providers/useGithubAuth";
// import { handleRequest } from "@utils/handleRequest";
// import { api } from "@constants/api";
// import { setItem } from "@constants/storage";
// import { setUser, UserState } from "./userSlice";
// import { useRouter } from "expo-router";
// import { useDispatch } from "react-redux";
// import { useToast } from "@hooks/useToast";

WebBrowser.maybeCompleteAuthSession();

type OAuthLoginProps = {
  provider?: "google" | "github" | "linkedin";
};

export function OAuthLogin({ provider }: OAuthLoginProps) {
  // const [isLoading, setIsLoading] = useState(false)
  // const { showToast } = useToast()
  // const router = useRouter()
  // const dispatch = useDispatch()

  const redirectUri = makeRedirectUri({
    scheme: "gamix",
    native: "gamix://"
  });

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [_request, response, promptAsync] = selectedProvider.useProvider({
    redirectUri
  });

  // const handleProviderSignin = async ({ provider, token }: { provider: OAuthLoginProps['provider'], token?: string; }) => {
  //   if (isLoading || !token) return
  //   const data = await handleRequest<{ accessToken: string; refreshToken: string; user: UserState; }>({
  //     requestFn: async () => await api.post(`/auth/social-login/${provider}`, { token }, { skipAuth: true } as any),
  //     showToast,
  //     setIsLoading
  //   })
  //   if (!data) return
  //   dispatch(setUser(data.user))
  //   await setItem('user', JSON.stringify(data.user))
  //   await setItem('accessToken', data.accessToken)
  //   await setItem('refreshToken', data.refreshToken)
  //   router.replace('/application/feed')
  // }

  useEffect(() => {
    if (response?.type === "success") {
      // eslint-disable-next-line no-console
      console.log(response);
      // handleProviderSignin({ provider, token: response.authentication?.accessToken });
    }
  }, [response]);

  return (
    <Pressable onPress={() => promptAsync()}>
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
