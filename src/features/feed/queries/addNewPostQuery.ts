import { InfiniteData, QueryClient } from "@tanstack/react-query";
import { PostType } from "@/components/Post";
import { Tab } from "@/components/ContentTabs";

export const addNewPostQuery = ({
  data,
  queryClient,
  actualTab,
  lastFetchTime
}: {
  data: PostType;
  queryClient: QueryClient;
  actualTab: Tab["key"];
  lastFetchTime: string;
}) => {
  queryClient.setQueryData(
    ["posts", actualTab, lastFetchTime],
    (
      oldData:
        | InfiniteData<
            {
              page: number;
              nextPage: number | null;
              pages: number;
              total: number;
              data: PostType[];
            } | null,
            unknown
          >
        | undefined
    ) => {
      if (!oldData || !oldData.pages[0]) return oldData;

      const newData = {
        ...oldData,
        pages: [
          {
            ...oldData.pages[0],
            data: [data, ...oldData.pages[0].data],
            total: oldData.pages[0].total + 1
          },
          ...oldData.pages.slice(1)
        ]
      };

      return newData;
    }
  );
};
