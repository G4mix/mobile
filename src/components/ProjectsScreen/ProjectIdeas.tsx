import { TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Text, View } from "../Themed";
import { Idea, IdeaType } from "../Idea";
import { IdeaLoading } from "../Idea/IdeaLoading";
import { InView } from "../InView";
import { Colors } from "../../constants/colors";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { api } from "@/constants/api";
import { useProject } from "@/hooks/useProject";

const styles = StyleSheet.create({
  createIdeaButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "auto",
  },
  createIdeaButtonText: {
    color: Colors.light.white,
    fontSize: 13.33,
    fontWeight: 500,
  },
  ideas: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 12,
    marginBottom: 56,
    padding: 16,
    width: "100%",
  },
  ideasHeader: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ideasTitle: {
    color: Colors.light.russianViolet,
    fontSize: 19.2,
    fontWeight: "bold",
    marginBottom: 12,
  },
  shortIdeaContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
});

type IdeaPageable = {
  page: number;
  nextPage: number | null;
  pages: number;
  total: number;
  data: IdeaType[];
};

export function ProjectIdeas({ projectId }: { projectId: string }) {
  const { data: project } = useProject(projectId);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["ideas", { projectId }],
    queryFn: async ({ pageParam }) =>
      (
        await api.get<IdeaPageable>("/idea", {
          params: {
            page: pageParam,
            projectId,
            quantity: 10,
          },
        })
      ).data,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    enabled: !!projectId && !!project,
  });

  const ideas =
    data?.pages
      ?.flatMap((page) => page?.data || [])
      .filter((idea) => idea != null) || [];
  const isMember = project?.isMember || false;
  const isLoadingIdeas = isLoading || isFetching;

  return (
    <View style={styles.ideas}>
      <View style={styles.ideasHeader}>
        <Text style={styles.ideasTitle}>Ideias</Text>
        {isMember && (
          <Button
            style={styles.createIdeaButton}
            onPress={() => router.push(`/(tabs)/create?projectId=${projectId}`)}
          >
            <Icon name="plus-circle" size={20} color={Colors.light.white} />
            <Text style={styles.createIdeaButtonText}>Crie uma ideia</Text>
          </Button>
        )}
      </View>
      {isLoadingIdeas && !data && (
        <>
          {[1, 2, 3].map((idea) => (
            <IdeaLoading key={`idea-loading-initial-${idea}`} />
          ))}
        </>
      )}
      {!isLoadingIdeas && ideas.length === 0 && !isFetchingNextPage && (
        <Text
          style={{
            color: Colors.light.jet,
            fontSize: 13.33,
            textAlign: "center",
            paddingVertical: 24,
          }}
        >
          Este projeto ainda não tem ideias
        </Text>
      )}
      {ideas?.map((idea, index) => (
        <TouchableOpacity
          onPress={() => router.push(`/ideas/${idea!.id}`)}
          key={`idea-${idea?.id || index}`}
        >
          <View style={styles.shortIdeaContainer}>
            <Idea idea={idea} short />
          </View>
        </TouchableOpacity>
      ))}
      {isFetchingNextPage &&
        [1, 2, 3].map((idea) => <IdeaLoading key={`idea-loading-${idea}`} />)}
      {isFetchingNextPage || !hasNextPage ? null : (
        <InView onInView={fetchNextPage} />
      )}
    </View>
  );
}
