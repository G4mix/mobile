import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  // setNewPostIndicator,
  setLastFetchTime
  // loadLastFetchTime
} from "../features/feed/feedSlice";
import { api } from "@/constants/api";
// import { getItem } from "@/constants/storage";
import { PostType } from "@/components/Post";

type PostPageable = {
  page: number;
  nextPage: number | null;
  pages: number;
  total: number;
  data: PostType[];
};

export const useFeed = () => {
  // const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const lastFetchTime = useSelector((state: any) => state.feed.lastFetchTime);
  const actualTab = useSelector((state: any) => state.feed.actualTab);

  useEffect(() => {
    const loadTime = async () => {
      const now = new Date().toISOString();
      dispatch(setLastFetchTime(now));
    };
    loadTime();
  }, [dispatch]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", actualTab, lastFetchTime],
      queryFn: async ({ pageParam }) =>
        api.get<PostPageable>("/post", {
          params: {
            tab: actualTab,
            page: pageParam,
            since: lastFetchTime,
            quantity: 10
          }
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.data.nextPage,
      enabled: !!lastFetchTime
    });

  // useEffect(() => {
  //   const socket = new WebSocket(`wss://${process.env.EXPO_PUBLIC_API_URL}`);

  //   socket.onmessage = (event) => {
  //     const post = JSON.parse(event.data);
  //     queryClient.setQueryData(["posts", post.tab], (oldData: any) => ({
  //       pages: [[post, ...oldData.pages.flat()]]
  //     }));
  //     dispatch(setNewPostIndicator({ tab: post.tab }));
  //   };

  //   return () => socket.close();
  // }, []);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};
