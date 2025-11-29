import { Colors } from "../../constants/colors";
import { Text, View } from "../Themed";

export function ChatMessage({
  message,
  date,
  isActualUser = false,
  senderName,
}: {
  message: string;
  date: string;
  isActualUser: boolean;
  senderName?: string;
}) {
  return (
    <View
      style={{
        borderRadius: 8,
        paddingLeft: 16,
        paddingTop: 8,
        paddingBottom: 4,
        paddingRight: 12,
        borderBottomRightRadius: isActualUser ? 0 : 8,
        borderBottomLeftRadius: !isActualUser ? 0 : 8,
        backgroundColor: isActualUser
          ? Colors.light.background
          : Colors.light.russianViolet,
        maxWidth: "70%",
        alignSelf: isActualUser ? "flex-end" : "flex-start",
        flexDirection: "column",
        gap: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      {senderName && !isActualUser && (
        <Text
          style={{
            color: isActualUser
              ? Colors.light.russianViolet
              : Colors.light.background,
            fontWeight: 500,
            fontSize: 11.11,
            textAlign: "left",
          }}
        >
          {senderName}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          alignItems: "flex-start",
          backgroundColor: "transparent",
        }}
      >
        <Text
          style={{
            color: isActualUser
              ? Colors.light.russianViolet
              : Colors.light.background,
            fontWeight: 400,
            fontSize: 13.33,
            textAlign: "left",
            flexShrink: 1,
          }}
        >
          {message}
        </Text>
        <Text
          style={{
            color: Colors.light.silver,
            fontWeight: 400,
            fontSize: 11.11,
            alignSelf: "flex-end",
            marginTop: 6,
          }}
        >
          {date}
        </Text>
      </View>
    </View>
  );
}
