import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "./useToast";
import { getItem, setItem } from "@/constants/storage";
import { debounce } from "@/utils/debounce";
import { api } from "@/constants/api";
import { PostType } from "@/components/Post";

export const useViewPosts = (selectedTab: string) => {
  const [isSavingPosts, setIsSavingPosts] = useState(false);
  const [visualizedPosts, setVisualizedPosts] = useState<string[]>([]);
  const lastFetchTime = useSelector((state: any) => state.feed.lastFetchTime);
  const { showToast } = useToast();
  const alreadyVisualized = useRef<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const saveVisualizedPostsReq = async (posts: string[]) => {
    if (isSavingPosts) return;
    await handleRequest({
      requestFn: async () => api.post("/view", { posts }),
      showToast,
      setIsLoading: setIsSavingPosts
    });
  };

  const updatePostsCache = (updatedPosts: string[]) => {
    queryClient.setQueryData(
      ["posts", selectedTab, lastFetchTime],
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

  const saveVisualizedPostsInStorage = async (posts: string[]) => {
    try {
      const stored = await getItem("visualizedPosts");
      const previouslySaved: string[] = stored ? JSON.parse(stored) : [];

      const combinedSet = new Set([...previouslySaved, ...posts]);
      alreadyVisualized.current = combinedSet;

      await setItem("visualizedPosts", JSON.stringify(Array.from(combinedSet)));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      /* empty */
    }
  };

  const handleAfter10Seconds = useMemo(
    () =>
      debounce(async (posts: string[]) => {
        if (posts.length === 0) return;
        await saveVisualizedPostsReq(posts);
        updatePostsCache(posts);
        await saveVisualizedPostsInStorage(posts);
        setVisualizedPosts([]);
      }, 10000),
    []
  );

  useEffect(() => {
    if (visualizedPosts.length === 0) return;
    handleAfter10Seconds(visualizedPosts);
  }, [visualizedPosts, handleAfter10Seconds]);

  useEffect(() => {
    const loadVisualizedPosts = async () => {
      try {
        const stored = await getItem("visualizedPosts");
        if (stored) {
          alreadyVisualized.current = new Set(JSON.parse(stored));
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        /* empty */
      }
    };

    loadVisualizedPosts();
  }, []);

  return {
    alreadyVisualized,
    setVisualizedPosts
  };
};
