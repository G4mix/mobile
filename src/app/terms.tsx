import { StyleSheet, View } from "react-native";

import { Text } from "@/components/Themed";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Termos</Text>
    </View>
  );
}
