import { Image, Pressable, View } from "react-native";
import { Colors } from "@/constants/colors";
import * as WebBrowser from "expo-web-browser";
import { useGoogleAuth } from "./providers/useGoogleAuth";
import { useLinkedinAuth } from "./providers/useLinkedinAuth";
import { useGithubAuth } from "./providers/useGithubAuth";
import { makeRedirectUri } from "expo-auth-session";
import { useEffect } from "react";
// import { handleRequest } from "@/utils/handleRequest";
// import { api } from "@/constants/api";
// import { setItem } from "@/constants/storage";
// import { setUser, UserState } from "./userSlice";
// import { useRouter } from "expo-router";
// import { useDispatch } from "react-redux";
// import { useToast } from "@/hooks/useToast";

WebBrowser.maybeCompleteAuthSession();

type OAuthLoginProps = {
  provider?: 'google' | 'github' | 'linkedin';
}

export const OAuthLogin = ({ provider }: OAuthLoginProps) => {
  // const [isLoading, setIsLoading] = useState(false)
  // const { showToast } = useToast()
  // const router = useRouter()
  // const dispatch = useDispatch()

  const redirectUri = makeRedirectUri({
    scheme: 'gamix',
    native: "gamix://",
  });

  const providers = {
    google: {
      image: require('../../assets/images/icons/google.png'),
      useProvider: useGoogleAuth
    },
    linkedin: {
      image: require('../../assets/images/icons/linkedin.png'),
      useProvider: useLinkedinAuth
    },
    github: {
      image: require('../../assets/images/icons/github.png'),
      useProvider: useGithubAuth
    }
  }

  const selectedProvider = providers[provider as keyof typeof providers]
  if (!selectedProvider) return null
  console.log(redirectUri)
  const [_request, response, promptAsync] = selectedProvider.useProvider({ redirectUri })

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
      console.log(response)
      // handleProviderSignin({ provider, token: response.authentication?.accessToken });
    }
  }, [response]);

  return (
    <Pressable onPress={() => promptAsync()}>
      <View style={{borderRadius: 8, borderWidth: 1, borderColor: Colors.light.tropicalIndigo, padding: 6}}>
        <Image
          source={selectedProvider.image}
          style={{width: 32, height: 32}}
        />
      </View>
    </Pressable>
  )
}
