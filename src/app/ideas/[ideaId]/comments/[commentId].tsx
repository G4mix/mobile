import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Comment, CommentType } from "@/components/CommentsScreen/Comment";
import { CommentPageable, useComments } from "@/hooks/useComments";
import { InView } from "@/components/InView";
import { CommentInput } from "@/components/CommentsScreen/CommentInput";
import { IdeaType } from "@/components/Idea";
import { api } from "@/constants/api";
import { CommentLoading } from "@/components/CommentsScreen/CommentLoading";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

export default function RepliesScreen() {
  const { ideaId, commentId } = useLocalSearchParams<{
    ideaId: string;
    commentId: string;
  }>();

  const queryClient = useQueryClient();

  const { data: comment, refetch: refetchComment } = useQuery({
    queryKey: ["comment", { commentId, ideaId }],
    queryFn: async () => {
      const response = await api.get<CommentPageable>("/comment", {
        params: {
          ideaId,
          parentCommentId: commentId,
          page: 0,
          limit: 1
        }
      });
      return response.data.data[0];
    },
    enabled: !!commentId
  });

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
    refetch: refetchReplies
  } = useComments();

  const replies = data?.pages?.flatMap(page => page?.data || []) || [];
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

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["comment", commentId] });
    await queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    await queryClient.invalidateQueries({
      queryKey: ["comments", { ideaId, commentId }]
    });
    await refetchReplies();
    await refetchComment();
    await refetchIdea();
  };

  const { refreshControl } = usePullToRefresh({
    onRefresh: handleRefresh
  });

  if (isError) router.push("/feed");

  useEffect(() => setIsVisible(true), []);

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView
        style={{ flex: 1, position: "relative", marginBottom: 56 }}
        refreshControl={refreshControl}
      >
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
        {replies.map(reply => (
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
        {isFetchingNextPage &&
          [0, 1, 2].map(c => (
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
        commentsCount={idea?.comments || 0}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        replying={replying}
        setReplying={setReplying}
      />
    </View>
  );
}
