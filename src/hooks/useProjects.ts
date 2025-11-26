import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/constants/api";
import { ProjectPageable } from "@/types/project";

export const useProjects = (search?: string) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["projects", search],
      queryFn: async ({ pageParam }) =>
        (
          await api.get<ProjectPageable>("/project", {
            params: {
              page: pageParam,
              quantity: 10,
              search: search || "",
            },
          })
        ).data,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      enabled: true,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
};
