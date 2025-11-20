import { useQueryClient } from "@tanstack/react-query";

export const useFeedQueries = () => {
  const queryClient = useQueryClient();

  const invalidateAllIdeas = () => {
    queryClient.invalidateQueries(
      { queryKey: ["ideas"] },
      {
        cancelRefetch: true,
      },
    );
  };

  const invalidateIdeaQuery = (ideaId: string) => {
    queryClient.invalidateQueries(
      { queryKey: ["idea", ideaId] },
      {
        cancelRefetch: true,
      },
    );
  };

  const invalidateUserQuery = (userId: string) => {
    queryClient.invalidateQueries(
      { queryKey: ["user", userId] },
      {
        cancelRefetch: true,
      },
    );
  };

  const invalidateCommentsQuery = (ideaId: string, commentId?: string) => {
    queryClient.invalidateQueries(
      { queryKey: ["comments", { ideaId, commentId }] },
      {
        cancelRefetch: true,
      },
    );
  };

  return {
    invalidateAllIdeas,
    invalidateIdeaQuery,
    invalidateUserQuery,
    invalidateCommentsQuery,
  };
};
