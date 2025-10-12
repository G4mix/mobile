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
  const { postId, commentId } = useLocalSearchParams<{
    postId?: string;
    commentId?: string;
  }>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", { postId, commentId }],
      queryFn: async ({ pageParam }) =>
        (
          await api.get<CommentPageable>("/comment", {
            params: {
              ideaId: postId,
              commentId,
              page: pageParam,
              limit: 10
            }
          })
        ).data,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      enabled: !!postId
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};
