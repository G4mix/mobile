import { useEffect, useMemo, useRef, useState } from "react";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "./useToast";
import { debounce } from "@/utils/debounce";
import { api } from "@/constants/api";
import { useFeedQueries } from "./useFeedQueries";

export const useViewPosts = ({
  initialViewedPostIds = []
}: {
  initialViewedPostIds: string[];
}) => {
  const [isSavingPosts, setIsSavingPosts] = useState(false);
  const [visualizedPosts, setVisualizedPosts] = useState<string[]>([]);
  const { showToast } = useToast();
  const alreadyVisualized = useRef<Set<string>>(new Set(initialViewedPostIds));
  const { increaseViews } = useFeedQueries();

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

        posts.forEach((id) => alreadyVisualized.current.add(id));

        setVisualizedPosts([]);
      }, 10000),
    []
  );

  useEffect(() => {
    if (visualizedPosts.length === 0) return;
    handleAfter10Seconds(visualizedPosts);
  }, [visualizedPosts, handleAfter10Seconds]);

  const addVisualizedPost = (postId: string) => {
    if (alreadyVisualized.current.has(postId)) return;
    alreadyVisualized.current.add(postId);
    setVisualizedPosts((prev) => {
      if (prev.includes(postId)) return prev;
      return [...prev, postId];
    });
  };

  return {
    alreadyVisualized,
    addVisualizedPost
  };
};
