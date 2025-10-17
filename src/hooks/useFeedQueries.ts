import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { IdeaType } from "@/components/Idea";

export const useFeedQueries = ({ authorId }: { authorId?: string } = {}) => {
  const queryClient = useQueryClient();
  const lastFetchTime = useSelector((state: any) => state.feed.lastFetchTime);
  const actualTab = useSelector((state: any) => state.feed.actualTab);

  const addNewIdea = (idea: IdeaType) => {
    queryClient.setQueryData(
      ["ideas", { actualTab, lastFetchTime, authorId }],
      (oldData: any) => {
        if (!oldData || !oldData.pages[0]) return oldData;

        const newData = {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              data: [idea, ...oldData.pages[0].data],
              total: oldData.pages[0].total + 1,
            },
            ...oldData.pages.slice(1),
          ],
        };

        return newData;
      },
    );
  };

  const updateIdea = (updatedIdea: Partial<IdeaType>) => {
    queryClient.setQueryData(
      ["ideas", { actualTab, lastFetchTime, authorId }],
      (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        const updatedPages = oldData.pages.map((page: any) => {
          const ideaIndex = page.data.findIndex(
            (i: IdeaType) => i.id === updatedIdea.id,
          );

          if (ideaIndex !== -1) {
            const newData = [...page.data];
            newData[ideaIndex] = { ...newData[ideaIndex], ...updatedIdea };

            return {
              ...page,
              data: newData,
            };
          }

          return page;
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      },
    );
  };

  const increaseViews = (updatedIdeaIds: string[]) => {
    queryClient.setQueryData(
      ["ideas", { actualTab, lastFetchTime, authorId }],
      (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;
        const updatedIdeasData = oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((idea: IdeaType) => {
            const updatedIdea = updatedIdeaIds.find((i) => i === idea.id);
            if (updatedIdea) {
              return {
                ...idea,
                views: idea.isViewed ? idea.views : idea.views + 1,
                isViewed: true,
              };
            }
            return idea;
          }),
        }));
        return { ...oldData, pages: updatedIdeasData };
      },
    );
  };

  const removeIdea = (ideaId: string) => {
    queryClient.setQueryData(
      ["ideas", { actualTab, lastFetchTime, authorId }],
      (oldData: any) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page: any) => {
          if (!page) return page;

          const idsBefore = page.data.map((idea: any) => idea.id);
          const filteredData = page.data.filter(
            (idea: any) => idea.id !== ideaId,
          );

          const ideaWasInThisPage = idsBefore.length !== filteredData.length;

          return {
            ...page,
            data: filteredData,
            total: ideaWasInThisPage ? page.total - 1 : page.total,
          };
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      },
    );
  };

  const invalidateAllIdeas = () => {
    queryClient.invalidateQueries(
      ["ideas", { actualTab, lastFetchTime, authorId }] as any,
      {
        cancelRefetch: true,
      },
    );
  };

  return {
    addNewIdea,
    updateIdea,
    increaseViews,
    removeIdea,
    invalidateAllIdeas,
  };
};
