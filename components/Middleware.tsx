import { useRouter, usePathname } from "expo-router";
import { getItem } from "expo-secure-store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/auth/userSlice";
import { removeItem } from "@/constants/storage";
import { authEventEmitter } from "@/constants/authEventEmitter";

export function Middleware() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const checkAuth = async () => {
    const accessToken = await getItem("accessToken");
    const refreshToken = await getItem("refreshToken");
    const user = await getItem("user");

    if (!accessToken || !refreshToken || !user) {
      if (
        pathname !== "/" &&
        !pathname.startsWith("/auth") &&
        !["/terms"].includes(pathname)
      ) {
        router.replace("/");
      }
      return;
    }

    dispatch(setUser(JSON.parse(user)));
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    const subscription = authEventEmitter.addListener("logout", async () => {
      await removeItem("accessToken");
      await removeItem("refreshToken");
      router.replace("/");
    });

    return () => {
      subscription.removeAllListeners();
    };
  }, []);

  return null;
}
