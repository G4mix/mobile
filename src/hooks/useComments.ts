import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
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
  const lastFetchTime = useSelector(
    (state: any) => state.comments.lastFetchTime
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", { lastFetchTime, postId, commentId }],
      queryFn: async ({ pageParam }) =>
        (
          await api.get<CommentPageable>("/comment", {
            params: {
              postId,
              commentId,
              page: pageParam,
              since: lastFetchTime,
              quantity: 10
            }
          })
        ).data,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      enabled: !!lastFetchTime
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};
