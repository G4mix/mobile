import { router } from "expo-router";
import { Option } from "./Option";
import { logout } from "@/features/auth/userSlice";
import { removeItem } from "@/constants/storage";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";

export function Logout() {
  const { showConfirmationModal } = useConfirmationModal();

  return (
    <Option
      position="full"
      name="Sair da conta"
      color="red"
      onPress={() => {
        showConfirmationModal({
          title: "Logout",
          content: "Tem certeza de que deseja sair da sua conta?",
          handleConfirm: () => {
            logout();
            removeItem("user");
            removeItem("accessToken");
            removeItem("refreshToken");
            router.replace("/auth/signin");
          },
          actionName: "Desconectar"
        });
      }}
    />
  );
}
