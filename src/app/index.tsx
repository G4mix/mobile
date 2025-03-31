import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { SpinLoading } from "@/components/SpinLoading";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    gap: 16,
    justifyContent: "center"
  },
  title: {
    color: Colors.light.majorelleBlue,
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <SpinLoading />
      <Text style={styles.title}>Carregando...</Text>
    </View>
  );
}
