import { useInfiniteQuery } from "@tanstack/react-query";
import { UserState } from "@/features/auth/userSlice";
import { api } from "@/constants/api";

type UserPageable = {
  page: number;
  nextPage: number | null;
  pages: number;
  total: number;
  data: UserState[];
};

export const useUsers = ({ search }: { search: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["users", { search }],
      queryFn: async ({ pageParam }) =>
        (
          await api.get<UserPageable>("/user", {
            params: {
              search,
              page: pageParam,
              quantity: 10
            }
          })
        ).data,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      enabled: true
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};
