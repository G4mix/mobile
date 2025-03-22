import { StyleSheet } from "react-native";
import { Text } from "@/components/Themed";

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default function ProfileScreen() {
  return <Text style={styles.title}>Feed</Text>;
}
