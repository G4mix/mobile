import { router, useLocalSearchParams } from "expo-router";
import { View, ScrollView } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { api } from "@/constants/api";
import { Idea, IdeaType } from "@/components/Idea";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { Comment, CommentType } from "@/components/CommentsScreen/Comment";
import { useComments } from "@/hooks/useComments";
import { InView } from "@/components/InView";
import { CommentInput } from "@/components/CommentsScreen/CommentInput";
import { IdeaLoading } from "@/components/Idea/IdeaLoading";
import { CommentLoading } from "@/components/CommentsScreen/CommentLoading";
import { Colors } from "@/constants/colors";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

export default function IdeaScreen() {
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

  const { ideaId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const {
    data: idea,
    isLoading,
    isError,
    refetch: refetchIdea
  } = useQuery({
    queryKey: ["idea", ideaId],
    queryFn: async () => {
      const response = await api.get<IdeaType>(`/idea/${ideaId}`);
      return response.data;
    },
    enabled: !!ideaId
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments
  } = useComments();
  const comments = data?.pages?.flatMap((page) => page?.data || []) || [];

  const commentReply = async (commentId: string) => {
    router.push(`/ideas/${ideaId}/comments/${commentId}`);
  };

  const handleRefresh = async () => {
    // Invalidar e refazer fetch da idea e seus comentários
    await queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    await queryClient.invalidateQueries({
      queryKey: ["comments", { postId: ideaId }]
    });
    await refetchIdea();
    await refetchComments();
  };

  const { refreshControl } = usePullToRefresh({
    onRefresh: handleRefresh
  });

  if (isError) router.push("/feed");

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.light.background }}
        refreshControl={refreshControl}
      >
        {isLoading && <IdeaLoading />}
        <FloatingOptionsProvider>
          <ConfirmationModalProvider>
            <Idea idea={idea} />
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
        commentsCount={idea?.comments || 0}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        replying={replying}
        setReplying={setReplying}
      />
    </View>
  );
}
