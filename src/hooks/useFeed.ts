import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
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
  const lastFetchTime = useSelector((state: any) => state.feed.lastFetchTime);
  const actualTab = useSelector((state: any) => state.feed.actualTab);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", actualTab, lastFetchTime],
      queryFn: async ({ pageParam }) =>
        (
          await api.get<PostPageable>("/post", {
            params: {
              tab: actualTab,
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
