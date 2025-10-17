import { useEffect, useRef, useState } from "react";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "./useToast";
import { api } from "@/constants/api";
import { useFeedQueries } from "./useFeedQueries";

export const useViewIdeas = ({
  initialViewedIdeaIds = [],
}: {
  initialViewedIdeaIds: string[];
}) => {
  const [isSavingIdea, setIsSavingIdea] = useState(false);
  const { showToast } = useToast();
  const alreadyVisualized = useRef<Set<string>>(new Set(initialViewedIdeaIds));
  const { increaseViews } = useFeedQueries();
  const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const saveVisualizedIdeaReq = async (ideaId: string) => {
    if (isSavingIdea) return;
    await handleRequest({
      requestFn: async () => api.post("/view", { targetIdeaId: ideaId }),
      showToast,
      setIsLoading: setIsSavingIdea,
    });
    increaseViews([ideaId]);
  };

  const addVisualizedIdea = (ideaId: string) => {
    if (alreadyVisualized.current.has(ideaId)) return;

    // Cancelar timeout anterior se existir
    const existingTimeout = timeouts.current.get(ideaId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Criar novo timeout para 3 segundos
    const timeout = setTimeout(async () => {
      alreadyVisualized.current.add(ideaId);
      await saveVisualizedIdeaReq(ideaId);
      timeouts.current.delete(ideaId);
    }, 3000);

    timeouts.current.set(ideaId, timeout);
  };

  const removeVisualizedIdea = (ideaId: string) => {
    const timeout = timeouts.current.get(ideaId);
    if (timeout) {
      clearTimeout(timeout);
      timeouts.current.delete(ideaId);
    }
  };

  // Cleanup dos timeouts quando o componente for desmontado
  useEffect(
    () => () => {
      timeouts.current.forEach((timeout) => clearTimeout(timeout));
      timeouts.current.clear();
    },
    [],
  );

  return {
    alreadyVisualized,
    addVisualizedIdea,
    removeVisualizedIdea,
  };
};
