import { View, ScrollView } from "react-native";
import { router } from "expo-router";
import { Option } from "@/components/ConfigurationsScreen/Option";
import { Colors } from "@/constants/colors";
import { logout } from "@/features/auth/userSlice";
import { removeItem } from "@/constants/storage";

export default function ConfigurationsScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <View
        style={{
          flex: 1,
          position: "relative",
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 16
        }}
      >
        <View>
          <Option
            position="start"
            name="Informações da Conta"
            onPress={() => router.push("/configurations/account")}
          />
          <Option
            position="end"
            name="Privacidade e Segurança"
            onPress={() => router.push("/configurations/security")}
          />
        </View>
        <View>
          <Option
            position="start"
            name="Termos de Serviço"
            onPress={() => router.push("/terms")}
          />
          <Option
            position="end"
            name="Política de Privacidade"
            onPress={() => router.push("/privacy-policy")}
          />
        </View>
        <Option
          position="full"
          name="Sair da conta"
          color="red"
          onPress={() => {
            logout();
            removeItem("user");
            removeItem("accessToken");
            removeItem("refreshToken");
            router.replace("/auth/signin");
          }}
        />
      </View>
    </ScrollView>
  );
}
