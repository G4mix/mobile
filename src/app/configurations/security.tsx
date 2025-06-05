import { View, ScrollView } from "react-native";
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
      />
    </ScrollView>
  );
}
