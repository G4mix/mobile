import { View, ScrollView } from "react-native";
import { router } from "expo-router";
import { Option } from "@/components/ConfigurationsScreen/Option";
import { Colors } from "@/constants/colors";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { Logout } from "@/components/ConfigurationsScreen/Logout";

export default function ConfigurationsScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <View
        style={{
          flex: 1,
          position: "relative",
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 16,
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
        <ConfirmationModalProvider>
          <Logout />
        </ConfirmationModalProvider>
      </View>
    </ScrollView>
  );
}
