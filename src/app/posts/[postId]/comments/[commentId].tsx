import { View, ScrollView } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Comment, CommentType } from "@/components/CommentsScreen/Comment";
import { useComments } from "@/hooks/useComments";
import { InView } from "@/components/InView";
import { CommentInput } from "@/components/CommentsScreen/CommentInput";
import { Text } from "@/components/Themed";
import { PostType } from "@/components/Post";
import { api } from "@/constants/api";

export default function RepliesScreen() {
  const { postId, commentId } = useLocalSearchParams<{
    postId: string;
    commentId: string;
  }>();

  const { data: comment } = useQuery({
    queryKey: ["comment", commentId],
    queryFn: async () => {
      const response = await api.get<CommentType>(`/comment/${commentId}`);
      return response.data;
    },
    enabled: !!commentId
  });

  const {
    data: post,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await api.get<PostType>(`/post/${postId}`);
      return response.data;
    },
    enabled: !!postId
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
    author: undefined
  });
  const [isVisible, setIsVisible] = useState(false);

  const commentReply = async (
    parentComment: string,
    toMark: string,
    author: CommentType["author"]
  ) => {
    setReplying({ parentComment, toMark, author });
    setIsVisible(true);
  };

  if (isError) router.push("/feed");
  if (isLoading) return <Text>Carregando...</Text>;
  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView style={{ flex: 1, position: "relative", marginBottom: 56 }}>
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
          <View key={`comment-${reply.id}`}>
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
        {isFetchingNextPage || !hasNextPage ? null : (
          <InView onInView={fetchNextPage} />
        )}
      </ScrollView>
      <CommentInput
        commentsCount={post?.commentsCount || 0}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        replying={replying}
        setReplying={setReplying}
      />
    </View>
  );
}
