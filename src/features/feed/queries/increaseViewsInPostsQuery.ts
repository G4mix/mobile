import { QueryClient } from "@tanstack/react-query";
import { PostType } from "@/components/Post";
import { Tab } from "@/components/ContentTabs";

export const increaseViewsInPostsQuery = ({
  updatedPosts,
  queryClient,
  actualTab,
  lastFetchTime
}: {
  updatedPosts: string[];
  queryClient: QueryClient;
  actualTab: Tab["key"];
  lastFetchTime: string;
}) => {
  queryClient.setQueryData(
    ["posts", actualTab, lastFetchTime],
    (oldData: any) => {
      const updatedPostsData = oldData.pages.map((page: any) => ({
        ...page,
        data: page.data.map((post: PostType) => {
          const updatedPost = updatedPosts.find((p) => p === post.id);
          if (updatedPost) {
            return { ...post, viewCount: post.viewsCount + 1 };
          }
          return post;
        })
      }));
      return { ...oldData, pages: updatedPostsData };
    }
  );
};
