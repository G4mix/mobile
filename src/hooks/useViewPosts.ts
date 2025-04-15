import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "./useToast";
import { debounce } from "@/utils/debounce";
import { api } from "@/constants/api";
import { Tab } from "@/components/ContentTabs";
import { useFeedQueries } from "./useFeedQueries";

export const useViewPosts = (actualTab: Tab["key"]) => {
  const [isSavingPosts, setIsSavingPosts] = useState(false);
  const [visualizedPosts, setVisualizedPosts] = useState<string[]>([]);
  const lastFetchTime = useSelector((state: any) => state.feed.lastFetchTime);
  const { showToast } = useToast();
  const alreadyVisualized = useRef<Set<string>>(new Set());
  const { increaseViews } = useFeedQueries({ actualTab, lastFetchTime });

  const saveVisualizedPostsReq = async (posts: string[]) => {
    if (isSavingPosts) return;
    await handleRequest({
      requestFn: async () => api.post("/view", { posts }),
      showToast,
      setIsLoading: setIsSavingPosts
    });
  };

  const handleAfter10Seconds = useMemo(
    () =>
      debounce(async (posts: string[]) => {
        if (posts.length === 0) return;
        await saveVisualizedPostsReq(posts);
        increaseViews(posts);
        const combinedSet = new Set([...alreadyVisualized.current, ...posts]);
        alreadyVisualized.current = combinedSet;
        setVisualizedPosts([]);
      }, 10000),
    []
  );

  useEffect(() => {
    if (visualizedPosts.length === 0) return;
    handleAfter10Seconds(visualizedPosts);
  }, [visualizedPosts, handleAfter10Seconds]);

  return {
    alreadyVisualized,
    setVisualizedPosts
  };
};
