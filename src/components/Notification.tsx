import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/colors";
import { Text } from "./Themed";
import { getImgWithTimestamp } from "../utils/getImgWithTimestamp";
import { NotificationDto } from "@/features/notifications/notificationsSlice";
import { formatNotificationMessage } from "@/utils/formatNotificationMessage";

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
    flex: 1,
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
  unreadIndicator: {
    backgroundColor: Colors.light.majorelleBlue,
    borderRadius: 4,
    height: 8,
    position: "absolute",
    right: 8,
    top: 8,
    width: 8,
  },
  userText: {
    color: Colors.light.russianViolet,
    fontSize: 16,
    fontWeight: "bold",
  },
});

function formatDate(date: Date | string): string {
  const now = new Date();
  const notificationDate = typeof date === "string" ? new Date(date) : date;
  const diffInMs = now.getTime() - notificationDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return "Agora";
  if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  if (diffInDays === 1) return "Ontem";
  if (diffInDays < 7) return `${diffInDays}d atrás`;

  return notificationDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year:
      notificationDate.getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
  });
}

export function Notification({
  notification,
  onPress,
}: {
  notification: NotificationDto;
  onPress?: () => void;
}) {
  const actorName = notification.actorProfile?.displayName || null;
  const icon = notification.actorProfile?.icon;
  const displayName = actorName || "Usuário";
  const message = formatNotificationMessage(notification);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={{ position: "relative" }}>
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
        {!notification.read && <View style={styles.unreadIndicator} />}
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>
          {actorName && <Text style={styles.userText}>@{actorName}</Text>}{" "}
          {message}
        </Text>
        <Text style={styles.dateText}>
          {formatDate(notification.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
