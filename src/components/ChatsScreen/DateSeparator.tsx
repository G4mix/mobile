import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import { Text, View } from "../../components/Themed";

const styles = StyleSheet.create({
  dateText: {
    color: Colors.light.jet,
    fontSize: 16,
  },
  separatorContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.dark.white,
    borderRadius: 8,
    elevation: 4,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

export function DateSeparator({ date }: { date: string }) {
  return (
    <View style={styles.separatorContainer}>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  );
}
