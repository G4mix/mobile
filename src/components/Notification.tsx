import { View, StyleSheet, Image } from "react-native";
import { Colors } from "@/constants/colors";
import { Text } from "./Themed";
import { getImgWithTimestamp } from "../utils/getImgWithTimestamp";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderColor: Colors.light.periwinkle,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 12,
  },
  content: {
    gap: 4,
  },
  contentText: {
    color: Colors.light.russianViolet,
    fontSize: 16,
    fontWeight: "medium",
    maxWidth: "96%",
    textAlign: "justify",
  },
  dateText: {
    color: Colors.dark.jet,
    fontSize: 13.33,
  },
  imageProfile: {
    borderRadius: 8,
    height: 48,
    width: 48,
  },
  userText: {
    color: Colors.light.russianViolet,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export function Notification({
  displayName,
  ideaName,
  icon,
  date,
}: {
  displayName: string;
  ideaName: string;
  icon?: string | null;
  date: string;
}) {
  return (
    <View style={styles.container}>
      {icon ? (
        <Image
          source={{ uri: getImgWithTimestamp(icon) }}
          style={styles.imageProfile}
        />
      ) : (
        <View
          style={{
            ...styles.imageProfile,
            backgroundColor: "#6200ee",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            {displayName.trim()[0].toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.contentText}>
          <Text style={styles.userText}>@{displayName}</Text> deseja participar
          da ideia {ideaName}
        </Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </View>
  );
}
