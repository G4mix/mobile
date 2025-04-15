import { InfiniteData, QueryClient } from "@tanstack/react-query";
import { PostType } from "@/components/Post";
import { Tab } from "@/components/ContentTabs";

export const removePostFromQuery = ({
  queryClient,
  actualTab,
  lastFetchTime,
  selectedPost
}: {
  queryClient: QueryClient;
  actualTab: Tab["key"];
  lastFetchTime: string;
  selectedPost: string;
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
      if (!oldData) return oldData;

      const updatedPages = oldData.pages.map((page) => {
        if (!page) return page;

        const idsBefore = page.data.map((post) => post.id);
        const filteredData = page.data.filter(
          (post) => post.id !== selectedPost
        );

        const postWasInThisPage = idsBefore.length !== filteredData.length;

        return {
          ...page,
          data: filteredData,
          total: postWasInThisPage ? page.total - 1 : page.total
        };
      });

      return {
        ...oldData,
        pages: updatedPages
      };
    }
  );
  queryClient.invalidateQueries(["posts", actualTab, lastFetchTime] as any);
};
