import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/constants/api";
import { IdeaType } from ".";
import { Header } from "../Header";
import { IdeaOptions } from "./IdeaOptions";

export function IdeaHeader({ route, ...props }: NativeStackHeaderProps) {
  const ideaId = (route.params as { ideaId?: string })?.ideaId;
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: idea } = useQuery({
    queryKey: ["idea", ideaId],
    queryFn: async () => {
      const response = await api.get<IdeaType>(`/idea/${ideaId}`);
      return response.data;
    },
    enabled: !!ideaId,
  });

  const rightComponent = idea ? (
    <IdeaOptions
      ideaId={idea.id}
      author={idea.author}
      isDeleting={isDeleting}
      setIsDeleting={setIsDeleting}
    />
  ) : null;

  return (
    <Header
      {...props}
      route={route}
      title="Comentários"
      rightComponent={rightComponent}
    />
  );
}
