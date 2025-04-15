import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setNewPostIndicator,
  setLastFetchTime
} from "../features/feed/feedSlice";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "./useToast";
import { PostType } from "@/components/Post";

type PostPageable = {
  page: number;
  nextPage: number | null;
  pages: number;
  total: number;
  data: PostType[];
};

export const useFeed = (selectedTab: string) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const lastFetchTime = useSelector((state: any) => state.feed.lastFetchTime);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTimeFromStorage = async () => {
      const now = new Date().toISOString();
      dispatch(setLastFetchTime(now));
    };
    loadTimeFromStorage();
  }, [dispatch]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", selectedTab, lastFetchTime],
      queryFn: async ({ pageParam }) =>
        handleRequest<PostPageable>({
          requestFn: async () =>
            api.get("/post", {
              params: {
                tab: selectedTab,
                page: pageParam,
                since: lastFetchTime,
                quantity: 10
              }
            }),
          showToast,
          setIsLoading
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      enabled: !!lastFetchTime
    });

  useEffect(() => {
    const socket = new WebSocket(`wss://${process.env.EXPO_PUBLIC_API_URL}`);

    socket.onmessage = (event) => {
      const post = JSON.parse(event.data);
      queryClient.setQueryData(["posts", post.tab], (oldData: any) => ({
        pages: [[post, ...oldData.pages.flat()]]
      }));
      dispatch(setNewPostIndicator({ tab: post.tab }));
    };

    return () => socket.close();
  }, []);

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    lastFetchTime,
    queryClient
  };
};
