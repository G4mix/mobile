import { TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Icon, IconName } from "../Icon";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";
import { useToast } from "@/hooks/useToast";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { handleRequest } from "@/utils/handleRequest";
import { debounce } from "@/utils/debounce";
import { api } from "@/constants/api";
import { useFeedQueries } from "@/hooks/useFeedQueries";
import { Button } from "../Button";

const styles = StyleSheet.create({
  actionContainer: {
    alignItems: "center",
    borderRadius: 32,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    padding: 16,
  },
  actionIcons: {
    flexDirection: "row",
    gap: 12,
  },
  actionOption: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 4,
  },
});

type IdeaActionsProps = {
  ideaId: string;
  likes: number;
  comments: number;
  liked: boolean;
};

export function IdeaActions({
  ideaId,
  likes,
  comments,
  liked,
}: IdeaActionsProps) {
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(liked);
  const [currentLikesCount, setCurrentLikesCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(false);
  const { updateIdea } = useFeedQueries();

  const likePostRequest = async (
    newIsLiked: boolean,
    newLikesCount: number,
  ) => {
    if (isLoading) return;
    const data = await handleRequest({
      requestFn: async () =>
        api.post("/like", {
          targetLikeId: ideaId,
          likeType: "Idea",
        }),
      showToast,
      setIsLoading,
      ignoreErrors: true,
    });
    if (!data) return;
    updateIdea({
      id: ideaId,
      isLiked: newIsLiked,
      likes: newLikesCount,
    });
  };

  const debouncedLikePost = useRef(
    debounce(
      (newIsLiked: boolean, newLikesCount: number) =>
        likePostRequest(newIsLiked, newLikesCount),
      700,
    ),
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
    router.push(`/ideas/${ideaId}`);
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
      handlePress: likePost,
    },
    {
      icon: "chat-bubble-left-right",
      color: Colors.light.russianViolet,
      content: abbreviateNumber(comments),
      handlePress: commentPost,
    },
  ];

  return (
    <View style={styles.actionContainer}>
      <View style={styles.actionIcons}>
        {actions.map(({ color, icon, handlePress, content }) => (
          <TouchableOpacity
            key={`post-action-${icon}`}
            style={styles.actionOption}
            onPress={handlePress}
          >
            <Icon size={24} name={icon} color={color} />
            {content && (
              <Text
                style={{
                  fontSize: 13.33,
                  color,
                  fontWeight: "medium",
                }}
              >
                {content}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <Button
        style={{
          minWidth: "auto",
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text lightColor="white">Quero Colaborar</Text>
      </Button>
    </View>
  );
}
