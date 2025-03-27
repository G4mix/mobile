import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, IconName } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  actionOption: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 4
  }
});

export function PostActions() {
  const actions: {
    icon: IconName;
    color: string;
    content?: string;
    handlePress: () => void;
  }[] = [
    {
      icon: "hand-thumb-up",
      color: Colors.light.russianViolet,
      content: "12k",
      handlePress: () => undefined
    },
    {
      icon: "chat-bubble-left-right",
      color: Colors.light.russianViolet,
      content: "12k",
      handlePress: () => undefined
    },
    {
      icon: "chart-bar",
      color: Colors.light.russianViolet,
      content: "12k",
      handlePress: () => undefined
    },
    {
      icon: "share",
      color: Colors.dark.background,
      handlePress: () => undefined
    }
  ];

  return (
    <View style={styles.actionContainer}>
      {actions.map(({ color, icon, handlePress, content }) => (
        <TouchableOpacity
          key={`post-action-${icon}`}
          style={styles.actionOption}
          onPress={handlePress}
        >
          <Icon size={18} name={icon} color={color} />
          {content && (
            <Text
              style={{
                fontSize: 12,
                color,
                fontWeight: "medium"
              }}
            >
              {content}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
