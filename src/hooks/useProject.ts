import { useQuery } from "@tanstack/react-query";
import { api } from "@/constants/api";
import { ProjectDto } from "@/types/project";

export const useProject = (projectId: string | undefined) =>
  useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await api.get<ProjectDto>(`/project/${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
  });
