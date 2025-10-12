import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/constants/api";
import { CommentType } from "@/components/CommentsScreen/Comment";

export type CommentPageable = {
  page: number;
  nextPage: number | null;
  pages: number;
  total: number;
  data: CommentType[];
};

export const useComments = () => {
  const { ideaId, commentId } = useLocalSearchParams<{
    ideaId?: string;
    commentId?: string;
  }>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["comments", { ideaId, commentId }],
      queryFn: async ({ pageParam }) =>
        (
          await api.get<CommentPageable>("/comment", {
            params: {
              ideaId,
              parentCommentId: commentId,
              page: pageParam,
              limit: 10
            }
          })
        ).data,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      enabled: !!ideaId
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  };
};
