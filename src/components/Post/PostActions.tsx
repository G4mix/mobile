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
import { useFeedQueries } from "@/hooks/useFeedQueries";

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
  liked: boolean;
  viewed: boolean;
};

export function PostActions({
  postId,
  likesCount,
  commentsCount,
  viewsCount,
  liked,
  viewed
}: PostActionsProps) {
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(liked);
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const [isLoading, setIsLoading] = useState(false);
  const { updatePost } = useFeedQueries();

  const likePostRequest = async (
    newIsLiked: boolean,
    newLikesCount: number
  ) => {
    if (isLoading) return;
    const data = await handleRequest({
      requestFn: async () =>
        api.get(`/like/post?isLiked=${newIsLiked}&postId=${postId}`),
      showToast,
      setIsLoading,
      ignoreErrors: true
    });
    if (!data) return;
    updatePost({
      id: postId,
      isLiked: newIsLiked,
      likesCount: newLikesCount
    });
  };

  const debouncedLikePost = useRef(
    debounce(
      (newIsLiked: boolean, newLikesCount: number) =>
        likePostRequest(newIsLiked, newLikesCount),
      700
    )
  ).current;

  const likePost = async () => {
    setIsLiked((prevValue) => {
      const newValue = !prevValue;
      setCurrentLikesCount((prevCount) => {
        const newLikesCount = !prevValue ? prevCount + 1 : prevCount - 1;
        debouncedLikePost(newValue, newLikesCount);
        return newLikesCount;
      });
      return newValue;
    });
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
      color: isLiked ? Colors.light.majorelleBlue : Colors.light.russianViolet,
      content: abbreviateNumber(currentLikesCount),
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
      color: viewed ? Colors.light.majorelleBlue : Colors.light.russianViolet,
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
