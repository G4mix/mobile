import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/constants/api";
import { IdeaType } from "@/components/Idea";

type IdeaPageable = {
  page: number;
  nextPage: number | null;
  pages: number;
  total: number;
  data: IdeaType[];
};

export const useFeed = ({ authorId }: { authorId?: string } = {}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["ideas", { authorId }],
      queryFn: async ({ pageParam }) =>
        (
          await api.get<IdeaPageable>("/idea", {
            params: {
              page: pageParam,
              authorId,
              quantity: 10,
            },
          })
        ).data,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      enabled: true,
    });
  // useEffect(() => {
  //   const socket = new WebSocket(`wss://${process.env.EXPO_PUBLIC_API_URL}`);

  //   socket.onmessage = (event) => {
  //     const post = JSON.parse(event.data);
  //     queryClient.setQueryData(["ideas", { actualTab: post.tab, lastFetchTime }], (oldData: any) => ({
  //       pages: [[post, ...oldData.pages.flat()]]
  //     }));
  //     dispatch(setNewIdeaIndicator({ tab: idea.tab }));
  //   };

  //   return () => socket.close();
  // }, []);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
};
