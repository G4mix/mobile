import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { Icon, IconName } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { useToast } from "@/hooks/useToast";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { handleRequest } from "@/utils/handleRequest";
import { debounce } from "@/utils/debounce";
import { api } from "@/constants/api";
import { CommentPageable } from "@/hooks/useComments";

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row",
    gap: 10,
  },
  actionOption: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 4,
  },
});

type CommentActionsProps = {
  commentReply: () => void;
  commentId: string;
  ideaId: string;
  liked: boolean;
  likesCount: number;
};

export function CommentActions({
  commentReply,
  commentId,
  ideaId,
  liked,
  likesCount,
}: CommentActionsProps) {
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(liked);
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const [isLoading, setIsLoading] = useState(false);
  const lastFetchTime = useSelector(
    (state: any) => state.comments.lastFetchTime,
  );
  const queryClient = useQueryClient();

  const addLikeCount = (data: { isLiked: boolean; likesCount: number }) => {
    queryClient.setQueryData(
      ["comments", { lastFetchTime, ideaId, commentId }],
      (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: CommentPageable) => ({
            ...page,
            data: page.data.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    isLiked: data.isLiked,
                    likesCount: data.likesCount,
                  }
                : comment,
            ),
          })),
        };
      },
    );
  };

  const likeCommentRequest = async (
    newIsLiked: boolean,
    newLikesCount: number,
  ) => {
    if (isLoading) return;
    const data = await handleRequest({
      requestFn: async () =>
        api.post("/like", {
          targetLikeId: commentId,
          likeType: "Comment",
        }),
      showToast,
      setIsLoading,
      ignoreErrors: true,
    });
    if (!data) return;
    addLikeCount({
      isLiked: newIsLiked,
      likesCount: newLikesCount,
    });
  };

  const debouncedLikeComment = useRef(
    debounce(
      (newIsLiked: boolean, newLikesCount: number) =>
        likeCommentRequest(newIsLiked, newLikesCount),
      700,
    ),
  ).current;

  const likeComment = async () => {
    setIsLiked((prevValue) => {
      const newValue = !prevValue;
      setCurrentLikesCount((prevCount) => {
        const newLikesCount = !prevValue ? prevCount + 1 : prevCount - 1;
        debouncedLikeComment(newValue, newLikesCount);
        return newLikesCount;
      });
      return newValue;
    });
  };

  const actions: {
    icon: IconName;
    color: string;
    content?: string;
    handlePress: () => void;
  }[] = [
    {
      icon: "hand-thumb-up",
      color: isLiked ? Colors.light.majorelleBlue : Colors.light.russianViolet,
      content: abbreviateNumber(currentLikesCount),
      handlePress: likeComment,
    },
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
                fontWeight: "medium",
              }}
            >
              {content}
            </Text>
          )}
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={commentReply}>
        <Text style={{ color: Colors.light.russianViolet }}>Responder</Text>
      </TouchableOpacity>
    </View>
  );
}
