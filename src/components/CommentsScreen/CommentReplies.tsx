import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Text } from "../Themed";
import { CommentType } from "./Comment";
import { Icon } from "../Icon";

export function CommentReplies({ comment }: { comment: CommentType }) {
  return (
    <TouchableOpacity
      onPress={() =>
        router.push(`/posts/${comment.postId}/comments/${comment.id}`)
      }
      style={{
        width: "100%",
        paddingVertical: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 4
      }}
    >
      <Text>
        {comment.repliesCount} repl{comment.repliesCount === 1 ? "y" : "ies"}
      </Text>
      <Icon name="chevron-right" size={16} />
    </TouchableOpacity>
  );
}
