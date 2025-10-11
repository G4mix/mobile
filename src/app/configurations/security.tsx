import { View, ScrollView } from "react-native";
import { router } from "expo-router";
import { Option } from "@/components/ConfigurationsScreen/Option";
import { Colors } from "@/constants/colors";

export default function SecurityScreen() {
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
            position="full"
            name="Altere sua senha"
            icon="lock-closed"
            onPress={() => router.push("/configurations/password")}
          />
        </View>
        <View>
          <Option
            position="full"
            name="Política de Privacidade"
            onPress={() => router.push("/privacy-policy")}
          />
        </View>
      </View>
    </ScrollView>
  );
}
