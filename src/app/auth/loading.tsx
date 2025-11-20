import { router, useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setUser, UserState } from "@/features/auth/userSlice";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { setItem } from "@/constants/storage";
import { useToast } from "@/hooks/useToast";
import { SpinLoading } from "@/components/SpinLoading";

export default function AuthLoadingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();

  const handleProviderSignin = async () => {
    if (isLoading) return;

    const error = params.error as string;
    if (error) {
      router.replace("/auth/signin");
      showToast({ message: error, color: "error" });
      return;
    }
    const token = params.token as string;
    const provider = params.provider as string;

    if (!token || !provider) {
      router.replace("/auth/signin");
      showToast({ message: "WITHOUT_NECESSARY_DATA", color: "error" });
      return;
    }

    const data = await handleRequest<{
      accessToken: string;
      refreshToken: string;
      user: UserState;
    }>({
      requestFn: async () =>
        api.post(`/auth/social-login/${provider}`, { token }, {
          skipAuth: true,
        } as any),
      showToast,
      setIsLoading,
    });

    if (!data) {
      router.replace("/auth/signin");
      return;
    }

    dispatch(setUser(data.user));
    await setItem("user", JSON.stringify(data.user));
    await setItem("accessToken", data.accessToken);
    await setItem("refreshToken", data.refreshToken);
    router.replace("/feed");
  };

  useEffect(() => {
    handleProviderSignin();
  }, []);

  return <SpinLoading />;
}
