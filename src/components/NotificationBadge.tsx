import { View, StyleSheet, Text } from "react-native";
import { Colors } from "@/constants/colors";

interface NotificationBadgeProps {
  count: number;
}
const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    backgroundColor: Colors.light.red,
    borderColor: Colors.light.background,
    borderRadius: 7,
    borderWidth: 1,
    height: 14,
    justifyContent: "center",
    minWidth: 14,
    paddingHorizontal: 2,
    position: "absolute",
    right: -1,
    top: -1,
  },
  badgeText: {
    color: Colors.light.background,
    fontSize: 8,
    fontWeight: "bold",
  },
});
export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > 9 ? "9+" : count.toString();

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{displayCount}</Text>
    </View>
  );
}
