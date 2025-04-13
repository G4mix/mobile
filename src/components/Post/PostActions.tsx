import { View, TouchableOpacity, StyleSheet, Share, Alert } from "react-native";
import { Icon, IconName } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { useToast } from "@/hooks/useToast";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { useRouter } from "expo-router";

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
  postId: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
};

export function PostActions({ postId, likesCount, commentsCount, viewsCount }: PostActionsProps) {
  const { showToast } = useToast();
  const router = useRouter();

  const likePost = async () => {}

  const commentPost = async () => {
    router.push(`/posts/${postId}`);
  }

  const sharePost = async () => {
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

  const actions: {
    icon: IconName;
    color: string;
    content?: string;
    handlePress?: () => void;
  }[] = [
    {
      icon: "hand-thumb-up",
      color: Colors.light.russianViolet,
      content: abbreviateNumber(likesCount),
      handlePress: likePost
    },
    {
      icon: "chat-bubble-left-right",
      color: Colors.light.russianViolet,
      content: abbreviateNumber(commentsCount),
      handlePress: commentPost
    },
    {
      icon: "chart-bar",
      color: Colors.light.russianViolet,
      content: abbreviateNumber(viewsCount)
    },
    {
      icon: "share",
      color: Colors.dark.background,
      handlePress: sharePost
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
