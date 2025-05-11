import { router, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { api } from "@/constants/api";
import { Post, PostType } from "@/components/Post";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { Comment, CommentType } from "@/components/CommentsScreen/Comment";
import { useComments } from "@/hooks/useComments";
import { InView } from "@/components/InView";
import { CommentInput } from "@/components/CommentsScreen/CommentInput";

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
  const scrollRef = useRef<ScrollView>(null);

  const commentReply = async (
    commentId: string,
    toMark: string,
    author: CommentType["author"]
  ) => {
    setReplying({ parentComment: commentId, toMark, author });
    setIsVisible(true);
  };

  if (isError) router.push("/feed");
  if (isLoading) return <Text>Carregando...</Text>;

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView style={{ flex: 1 }}>
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
                commentReply={() =>
                  commentReply(comment.id, comment.id, comment.author)
                }
                commentType="comment"
              />
            </View>
          ))}
          {isFetchingNextPage || !hasNextPage ? null : (
            <InView onInView={fetchNextPage} scrollRef={scrollRef} />
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
