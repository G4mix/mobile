import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "./useToast";
import { getItem, setItem } from "@/constants/storage";
import { debounce } from "@/utils/debounce";
import { api } from "@/constants/api";
import { increaseViewsInPostsQuery } from "@/features/feed/queries/increaseViewsInPostsQuery";
import { Tab } from "@/components/ContentTabs";

export const useViewPosts = (actualTab: Tab["key"]) => {
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
        increaseViewsInPostsQuery({
          actualTab,
          lastFetchTime,
          queryClient,
          updatedPosts: posts
        });
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
