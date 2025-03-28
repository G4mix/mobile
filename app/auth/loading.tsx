import { StyleSheet } from "react-native";

import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Text, View } from "@/components/Themed";
import { setUser, UserState } from "@/features/auth/userSlice";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { getItem, setItem } from "@/constants/storage";
import { useToast } from "@/hooks/useToast";
import { SpinLoading } from "@/components/SpinLoading";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    gap: 16,
    justifyContent: "center"
  },
  title: {
    color: Colors.light.majorelleBlue,
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default function AuthLoadingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();

  const handleProviderSignin = async () => {
    if (isLoading) return;

    const code = params.code as string;
    const provider = params.provider as string;

    if (!code || !provider) {
      router.replace("/");
      return;
    }
    let codeVerifier: any;
    if (provider === "google") codeVerifier = await getItem("codeVerifier");
    const data = await handleRequest<{
      accessToken: string;
      refreshToken: string;
      user: UserState;
    }>({
      requestFn: async () =>
        api.post(`/auth/social-login/${provider}`, { code, codeVerifier }, {
          skipAuth: true
        } as any),
      showToast,
      setIsLoading
    });

    if (!data) {
      router.replace("/");
      return;
    }

    dispatch(setUser(data.user));
    await setItem("user", JSON.stringify(data.user));
    await setItem("accessToken", data.accessToken);
    await setItem("refreshToken", data.refreshToken);
    router.replace("/application/feed");
  };

  useEffect(() => {
    handleProviderSignin();
  }, []);

  return (
    <View style={styles.container}>
      <SpinLoading />
      <Text style={styles.title}>Carregando...</Text>
    </View>
  );
}
