import { View, TouchableOpacity, StyleSheet } from "react-native";
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
    gap: 10
  },
  actionOption: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 4
  }
});

type CommentActionsProps = {
  postId: string;
  commentId: string;
  likesCount: number;
};

export function CommentActions({
  postId,
  commentId,
  likesCount
}: CommentActionsProps) {
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const likeCommentRequest = async () => {
    if (isLoading) return;
    handleRequest({
      requestFn: async () =>
        api.get(`/like/comment?isLiked=${isLiked}&commentId=${commentId}`),
      showToast,
      setIsLoading,
      ignoreErrors: true
    });
  };

  const debouncedLikeComment = useRef(
    debounce(likeCommentRequest, 700)
  ).current;

  const likeComment = async () => {
    setIsLiked((prevValue) => !prevValue);
    debouncedLikeComment();
  };
  const commentReply = async () => {
    router.push(`/posts/${postId}/comments/${commentId}`);
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
      content: abbreviateNumber(isLiked ? likesCount + 1 : likesCount),
      handlePress: likeComment
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
      <TouchableOpacity onPress={commentReply}>
        <Text style={{ color: Colors.light.russianViolet }}>Responder</Text>
      </TouchableOpacity>
    </View>
  );
}
