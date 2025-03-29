import { View, TouchableOpacity, StyleSheet, Share } from "react-native";
import { Icon, IconName } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { useToast } from "@/hooks/useToast";

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

type PostActionsProps = {
  postId: number;
};

export function PostActions({ postId }: PostActionsProps) {
  const { showToast } = useToast();

  const actions: {
    icon: IconName;
    color: string;
    content?: string;
    handlePress?: () => void;
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
      content: "12k"
    },
    {
      icon: "share",
      color: Colors.dark.background,
      handlePress: async () => {
        try {
          await Share.share({
            title: "Olha só esse post do Gamix!",
            message: "Venha conferir esse novo post do Gamix comigo!",
            url: `https://g4mix.vercel.app/posts/${postId}`
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          showToast({
            message: "Houve um erro ao tentar compartilhar o post!",
            color: "error"
          });
        }
      }
    }
  ];

  return (
    <View style={styles.actionContainer}>
      {actions.map(({ color, icon, handlePress, content }) =>
        handlePress ? (
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
        ) : (
          <View key={`post-action-${icon}`} style={styles.actionOption}>
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
          </View>
        )
      )}
    </View>
  );
}
