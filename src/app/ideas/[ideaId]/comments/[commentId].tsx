import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Comment, CommentType } from "@/components/CommentsScreen/Comment";
import { useComments } from "@/hooks/useComments";
import { InView } from "@/components/InView";
import { CommentInput } from "@/components/CommentsScreen/CommentInput";
import { api } from "@/constants/api";
import { CommentLoading } from "@/components/CommentsScreen/CommentLoading";
import { Colors } from "../../../../constants/colors";

export default function RepliesScreen() {
  const { commentId } = useLocalSearchParams<{
    postId: string;
    commentId: string;
  }>();

  const { data: comment, isLoading } = useQuery({
    queryKey: ["comment", commentId],
    queryFn: async () => {
      const response = await api.get<CommentType>(`/comment/${commentId}`);
      return response.data;
    },
    enabled: !!commentId,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useComments();

  const replies = data?.pages?.flatMap((page) => page?.data || []) || [];
  const [replying, setReplying] = useState<{
    parentComment: string;
    toMark: string;
    author?: CommentType["author"];
  }>({
    parentComment: "",
    toMark: "",
    author: undefined,
  });
  const [isVisible, setIsVisible] = useState(false);

  const commentReply = async (
    parentComment: string,
    toMark: string,
    author: CommentType["author"],
  ) => {
    setReplying({ parentComment, toMark, author });
    setIsVisible(true);
  };

  useEffect(() => setIsVisible(true), []);

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: Colors.light.background,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 16,
      }}
    >
      <ScrollView style={{ flex: 1, position: "relative", marginBottom: 56 }}>
        {isLoading && <CommentLoading commentType="post" />}
        {comment && (
          <Comment
            key={`reply-${comment.id}`}
            comment={comment}
            replying={replying}
            commentReply={() =>
              commentReply(commentId, comment.id, comment.author)
            }
            commentType="post"
          />
        )}
        {replies.map((reply) => (
          <View key={`comment-${reply.id}`} style={{ paddingTop: 16 }}>
            <Comment
              key={`reply-${reply.id}`}
              comment={reply}
              replying={replying}
              commentReply={() =>
                commentReply(commentId, reply.id, reply.author)
              }
              commentType="comment"
            />
          </View>
        ))}
        {isFetchingNextPage &&
          [0, 1, 2].map((c) => (
            <CommentLoading
              key={`comment-loading-${c}`}
              commentType="comment"
            />
          ))}
        {isFetchingNextPage || !hasNextPage ? null : (
          <InView onInView={fetchNextPage} />
        )}
      </ScrollView>
      <CommentInput
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        replying={replying}
        setReplying={setReplying}
      />
    </View>
  );
}
