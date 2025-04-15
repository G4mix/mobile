import { View, TouchableOpacity, StyleSheet, Share } from "react-native";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Icon, IconName } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { useToast } from "@/hooks/useToast";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { handleRequest } from "@/utils/handleRequest";
import { debounce } from "@/utils/debounce";
import { api } from "@/constants/api";

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

export function PostActions({
  postId,
  likesCount,
  commentsCount,
  viewsCount
}: PostActionsProps) {
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const likePostRequest = async () => {
    if (isLoading) return;
    handleRequest({
      requestFn: async () =>
        api.get(`/like/post?isLiked=${isLiked}&postId=${postId}`),
      showToast,
      setIsLoading,
      ignoreErrors: true
    });
  };

  const debouncedLikePost = useRef(debounce(likePostRequest, 700)).current;

  const likePost = async () => {
    setIsLiked((prevValue) => !prevValue);
    debouncedLikePost();
  };

  const commentPost = async () => {
    router.push(`/posts/${postId}`);
  };

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
  };

  const actions: {
    icon: IconName;
    color: string;
    content?: string;
    handlePress?: () => void;
  }[] = [
    {
      icon: "hand-thumb-up",
      color: isLiked ? Colors.light.green : Colors.light.russianViolet,
      content: abbreviateNumber(isLiked ? likesCount + 1 : likesCount),
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
