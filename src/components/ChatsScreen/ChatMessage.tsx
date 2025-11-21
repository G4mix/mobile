import { Colors } from "../../constants/colors";
import { Text, View } from "../Themed";

export function ChatMessage({
  message,
  date,
  isActualUser = false,
}: {
  message: string;
  date: string;
  isActualUser: boolean;
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
        position: "relative",
        maxWidth: "70%",
        alignSelf: isActualUser ? "flex-end" : "flex-start",
        flexDirection: "row",
        gap: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
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
        }}
      >
        {message}
      </Text>
      <Text
        style={{
          color: Colors.light.silver,
          fontWeight: 400,
          fontSize: 11.11,
          marginTop: 4,
          alignSelf: "flex-end",
        }}
      >
        {date}
      </Text>
    </View>
  );
}
