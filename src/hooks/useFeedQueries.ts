import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { PostType } from "@/components/Post";

export const useFeedQueries = () => {
  const queryClient = useQueryClient();
  const lastFetchTime = useSelector((state: any) => state.feed.lastFetchTime);
  const actualTab = useSelector((state: any) => state.feed.actualTab);

  const addNewPost = (post: PostType) => {
    queryClient.setQueryData(
      ["posts", actualTab, lastFetchTime],
      (oldData: any) => {
        if (!oldData || !oldData.pages[0]) return oldData;

        const newData = {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              data: [post, ...oldData.pages[0].data],
              total: oldData.pages[0].total + 1
            },
            ...oldData.pages.slice(1)
          ]
        };

        return newData;
      }
    );
  };

  const increaseViews = (updatedPostIds: string[]) => {
    queryClient.setQueryData(
      ["posts", actualTab, lastFetchTime],
      (oldData: any) => {
        const updatedPostsData = oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((post: PostType) => {
            const updatedPost = updatedPostIds.find((p) => p === post.id);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const removePost = (_postId: string) => {
    // queryClient.setQueryData(
    //   ["posts", actualTab, lastFetchTime],
    //   (oldData: any) => {
    //     if (!oldData) return oldData;

    //     const updatedPages = oldData.pages.map((page: any) => {
    //       if (!page) return page;

    //       const idsBefore = page.data.map((post: any) => post.id);
    //       const filteredData = page.data.filter(
    //         (post: any) => post.id !== postId
    //       );

    //       const postWasInThisPage = idsBefore.length !== filteredData.length;

    //       return {
    //         ...page,
    //         data: filteredData,
    //         total: postWasInThisPage ? page.total - 1 : page.total
    //       };
    //     });

    //     return {
    //       ...oldData,
    //       pages: updatedPages
    //     };
    //   }
    // );
    queryClient.invalidateQueries(["posts", actualTab, lastFetchTime] as any);
  };

  return {
    addNewPost,
    increaseViews,
    removePost
  };
};
