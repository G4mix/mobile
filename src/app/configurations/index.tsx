import { View, ScrollView, TouchableOpacity } from "react-native";
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
          <Option position="start" name="Informações da Conta" />
          <Option position="end" name="Privacidade e Segurança" />
        </View>
        <View>
          <Option position="start" name="Termos de Serviço" />
          <Option position="end" name="Política de Privacidade" />
        </View>
        <TouchableOpacity
          onPress={() => {
            logout();
            removeItem("user");
            removeItem("accessToken");
            removeItem("refreshToken");
            router.replace("/auth/signin");
          }}
        >
          <Option position="full" name="Sair da conta" color="red" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
