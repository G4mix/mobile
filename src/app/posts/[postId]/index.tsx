import { router, useLocalSearchParams } from "expo-router";
import { View, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { api } from "@/constants/api";
import { Post, PostType } from "@/components/Post";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { Comment, CommentType } from "@/components/CommentsScreen/Comment";
import { useComments } from "@/hooks/useComments";
import { InView } from "@/components/InView";
import { CommentInput } from "@/components/CommentsScreen/CommentInput";
import { PostLoading } from "@/components/Post/PostLoading";
import { CommentLoading } from "@/components/CommentsScreen/CommentLoading";

export default function PostScreen() {
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

  const { postId } = useLocalSearchParams();
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
  const comments = data?.pages?.flatMap((page) => page?.data || []) || [];

  const commentReply = async (commentId: string) => {
    router.push(`/posts/${postId}/comments/${commentId}`);
  };

  if (isError) router.push("/feed");

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView style={{ flex: 1 }}>
        {isLoading && <PostLoading />}
        <FloatingOptionsProvider>
          <ConfirmationModalProvider>
            <Post post={post} />
          </ConfirmationModalProvider>
        </FloatingOptionsProvider>
        <View style={{ marginBottom: 56 }}>
          {comments.map((comment) => (
            <View key={`comment-${comment.id}`}>
              <Comment
                comment={comment}
                replying={replying}
                commentReply={() => commentReply(comment.id)}
                commentType="comment"
              />
            </View>
          ))}
          {isFetchingNextPage &&
            [0, 1, 2].map((comment) => (
              <CommentLoading
                key={`comment-loading-${comment}`}
                commentType="comment"
              />
            ))}
          {isFetchingNextPage || !hasNextPage ? null : (
            <InView onInView={fetchNextPage} />
          )}
        </View>
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
