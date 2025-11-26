import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Text, View } from "@/components/Themed";
import { styles as feedStyles } from "../feed";
import { FeedHeader } from "@/components/FeedHeader";
import { Colors } from "@/constants/colors";
import { ProjectItem } from "@/components/ProjectsScreen/ProjectItem";
import { useProjects } from "@/hooks/useProjects";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { InView } from "@/components/InView";

export const styles = StyleSheet.create({
  ...feedStyles,
  projects: {
    ...feedStyles.ideas,
    backgroundColor: "transparent",
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scroll: {
    ...feedStyles.scroll,
    backgroundColor: "#F5F5F5",
  },
  title: {
    color: Colors.light.russianViolet,
    fontSize: 19.2,
    fontWeight: 700,
  },
});

export default function ProjectsScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useProjects();
  const queryClient = useQueryClient();

  const allProjects = data?.pages?.flatMap((page) => page?.data || []) || [];

  const userProjects = useMemo(
    () => allProjects.filter((project) => project.isOwner || project.isMember),
    [allProjects],
  );

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["projects"] });
    await refetch();
  };

  const { refreshControl } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  return (
    <View style={styles.container}>
      <FeedHeader />
      <ScrollView style={styles.scroll} refreshControl={refreshControl}>
        <View style={styles.projects}>
          <Text style={styles.title}>Projetos</Text>
          {userProjects.length === 0 && !isFetchingNextPage && (
            <Text
              style={{
                color: Colors.light.jet,
                fontSize: 13.33,
                textAlign: "center",
                paddingVertical: 24,
              }}
            >
              Você ainda não faz parte de nenhum projeto
            </Text>
          )}
          {userProjects.map((project) => (
            <ProjectItem
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              icon={project.icon || undefined}
              backgroundImage={project.backgroundImage || undefined}
              followersCount={project.followersCount}
              ideasCount={project.ideasCount}
              topFollowers={project.topFollowers}
            />
          ))}
          {isFetchingNextPage && (
            <ActivityIndicator
              size="large"
              color={Colors.light.majorelleBlue}
              style={{ paddingVertical: 16 }}
            />
          )}
          {isFetchingNextPage || !hasNextPage ? null : (
            <InView onInView={fetchNextPage} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
