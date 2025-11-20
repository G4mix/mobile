import { router, usePathname } from "expo-router";
import { getItem } from "expo-secure-store";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { setUser } from "@/features/auth/userSlice";
import { removeItem } from "@/constants/storage";
import { authEventEmitter } from "@/constants/authEventEmitter";
import { clearAccessTokenCache } from "@/constants/api";

export function useMiddleware() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const initialPaths: string[] = [
    "/auth/signin",
    "/auth/signup",
    "/auth/forget-password",
    "/auth/loading",
    "/",
  ];

  const checkAuth = async () => {
    const accessToken = await getItem("accessToken");
    const refreshToken = await getItem("refreshToken");
    const user = await getItem("user");
    if (!accessToken || !refreshToken || !user) {
      if (
        pathname !== "/auth/signin" &&
        !pathname.startsWith("/auth") &&
        !["/terms"].includes(pathname)
      ) {
        router.replace("/auth/signin");
      }
      return;
    }

    dispatch(setUser(JSON.parse(user)));
    if (initialPaths.includes(pathname)) {
      router.replace("/feed");
    }
  };

  const defineListeners = () => {
    const subscription = authEventEmitter.addListener("logout", async () => {
      queryClient.clear();
      clearAccessTokenCache();
      await removeItem("user");
      await removeItem("accessToken");
      await removeItem("refreshToken");
      router.replace("/auth/signin");
    });
    return () => {
      subscription.removeAllListeners();
    };
  };

  return { checkAuth, defineListeners, pathname };
}
