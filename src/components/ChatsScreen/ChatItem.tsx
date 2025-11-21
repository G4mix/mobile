import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { getImgWithTimestamp } from "../../utils/getImgWithTimestamp";
import { Text } from "../Themed";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  imageProfile: {
    borderRadius: 9999,
    height: 48,
    width: 48,
  },
});

type ChatItemProps = {
  id: string;
  icon?: string;
  displayName: string;
  lastMessage?: string;
  date?: string;
  unreadMessages: number;
};

export function ChatItem({
  id,
  displayName,
  icon,
  lastMessage,
  date,
  unreadMessages,
}: ChatItemProps) {
  return (
    <TouchableOpacity
      key={id}
      focusable={false}
      onPress={() => router.push(`/chats/${id}` as any)}
      style={{
        flexDirection: "row",
        gap: 12,
        width: "100%",
      }}
    >
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
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {displayName.trim()[0].toUpperCase()}
          </Text>
        </View>
      )}
      <View style={{ flexDirection: "column", gap: 4, flex: 1 }}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color:
                unreadMessages > 0
                  ? Colors.light.majorelleBlue
                  : Colors.light.text,
            }}
          >
            {displayName}
          </Text>
          <Text
            style={{
              color:
                unreadMessages > 0
                  ? Colors.light.majorelleBlue
                  : Colors.light.text,
            }}
          >
            {date}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color:
                unreadMessages > 0
                  ? Colors.light.majorelleBlue
                  : Colors.light.text,
            }}
          >
            {lastMessage ?? `Comece a conversar com ${displayName}`}
          </Text>
          {unreadMessages > 0 && (
            <Text
              style={{
                fontWeight: 600,
                fontSize: 13.33,
                backgroundColor: Colors.light.majorelleBlue,
                color: Colors.light.background,
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 32,
              }}
            >
              {unreadMessages}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
