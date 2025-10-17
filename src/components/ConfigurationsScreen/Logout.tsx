import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { Option } from "./Option";
import { logout } from "@/features/auth/userSlice";
import { removeItem } from "@/constants/storage";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { clearAccessTokenCache } from "@/constants/api";

export function Logout() {
  const { showConfirmationModal } = useConfirmationModal();
  const queryClient = useQueryClient();

  return (
    <Option
      position="full"
      name="Sair da conta"
      color="red"
      onPress={() => {
        showConfirmationModal({
          title: "Logout",
          content: "Tem certeza de que deseja sair da sua conta?",
          handleConfirm: async () => {
            queryClient.clear();

            clearAccessTokenCache();

            logout();

            await removeItem("user");
            await removeItem("accessToken");
            await removeItem("refreshToken");

            router.replace("/auth/signin");
          },
          actionName: "Desconectar",
        });
      }}
    />
  );
}
