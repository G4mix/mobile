import { router, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { api } from "@/constants/api";
import { Post, PostType } from "@/components/Post";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { Comment } from "@/components/CommentsScreen/Comment";
import { useComments } from "@/hooks/useComments";
import { InView } from "@/components/InView";

export default function PostScreen() {
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

  if (isError) router.push("/feed");
  if (isLoading) return <Text>Carregando...</Text>;

  return (
    <View>
      <FloatingOptionsProvider>
        <ConfirmationModalProvider>
          <Post post={post} />
        </ConfirmationModalProvider>
      </FloatingOptionsProvider>
      <View>
        {comments.map((comment) => (
          <Comment key={`comment-${comment.id}`} comment={comment} />
        ))}
        {isFetchingNextPage || !hasNextPage ? null : (
          <InView onInView={fetchNextPage} scrollRef={scrollRef} />
        )}
      </View>
    </View>
  );
}
