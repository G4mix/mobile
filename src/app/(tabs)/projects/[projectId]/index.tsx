import {
  PanResponder,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { Text, View } from "@/components/Themed";
import { styles as feedStyles } from "../../feed";
import { Colors } from "@/constants/colors";
import { Header } from "@/components/Header";
import { styles as projectItemStyles } from "../../../../components/ProjectsScreen/ProjectItem";
import { Icon } from "../../../../components/Icon";
import { Button } from "../../../../components/Button";
import { ContentTabs, Tab } from "../../../../components/ContentTabs";
import { ProjectAbout } from "../../../../components/ProjectsScreen/ProjectAbout";
import { ProjectIdeas } from "../../../../components/ProjectsScreen/ProjectIdeas";
import { setActualTab } from "../../../../features/projects/projectsSlice";
import { useProject } from "@/hooks/useProject";
import { useToast } from "@/hooks/useToast";
import { handleRequest } from "@/utils/handleRequest";
import { api } from "@/constants/api";
import { useFeedQueries } from "@/hooks/useFeedQueries";
import { getCachedImageUrl } from "@/utils/getCachedImageUrl";
import { ProjectMembersModal } from "@/components/ProjectsScreen/ProjectMembersModal";
import { ProjectOptions } from "@/components/ProjectsScreen/ProjectOptions";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

export const styles = StyleSheet.create({
  ...feedStyles,
  ...projectItemStyles,
  backgroundContainer: {
    ...projectItemStyles.backgroundContainer,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  createdBy: {
    color: Colors.light.majorelleBlue,
    fontSize: 11.11,
    fontWeight: 400,
  },
  createdByContainer: {
    color: Colors.light.jet,
    fontSize: 11.11,
    fontWeight: 400,
  },
  projects: {
    ...feedStyles.ideas,
    backgroundColor: "transparent",
  },
  root: {
    ...projectItemStyles.root,
    borderRadius: 0,
  },
  scroll: {
    ...feedStyles.scroll,
    backgroundColor: Colors.light.background,
  },
  title: {
    color: Colors.light.russianViolet,
    fontSize: 19.2,
    fontWeight: 700,
  },
});

export default function ProjectsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { data: project, isLoading, refetch } = useProject(projectId);
  const { showToast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { invalidateProjectQuery, invalidateProjectsQuery } = useFeedQueries();

  const actualTab = useSelector(
    (state: any) => state.projects.actualTab,
  ) as Tab<"project">["key"];
  const tabs: Tab<"project">[] = [
    { name: "Ideias", key: "ideas" },
    { name: "Sobre", key: "about" },
  ];

  const tabComponents = {
    ideas: ProjectIdeas,
    about: ProjectAbout,
  };

  const tabKeys = tabs.map((tab) => tab.key);
  const actualTabRef = useRef(actualTab);
  useEffect(() => {
    if (project) {
      setIsFollowing(project.isFollowing);
    }
  }, [project]);

  useEffect(() => {
    actualTabRef.current = actualTab;
  }, [actualTab]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20,
      onPanResponderRelease: (_, gestureState) => {
        const currentIndex = tabKeys.indexOf(actualTabRef.current);
        if (gestureState.dx < -50 && currentIndex < tabKeys.length - 1) {
          dispatch(setActualTab(tabKeys[currentIndex + 1]));
        } else if (gestureState.dx > 50 && currentIndex > 0) {
          dispatch(setActualTab(tabKeys[currentIndex - 1]));
        }
      },
    }),
  ).current;

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    await queryClient.invalidateQueries({
      queryKey: ["ideas", { projectId }],
    });
    await refetch();
  };

  const { refreshControl } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  const handleFollow = async () => {
    if (isLoadingFollow || !projectId) return;
    setIsLoadingFollow(true);
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);

    const result = await handleRequest({
      requestFn: async () =>
        api.post("/follow", {
          targetProjectId: projectId,
        }),
      showToast,
      setIsLoading: setIsLoadingFollow,
    });

    if (result === null) {
      setIsFollowing(!newFollowingState);
    } else {
      invalidateProjectQuery(projectId);
      invalidateProjectsQuery();
      await refetch();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          title="Voltar"
          route={route}
          navigation={navigation as any}
          options={{}}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.light.majorelleBlue} />
        </View>
      </View>
    );
  }

  if (!project) {
    return null;
  }

  const firstLetter = project.title.charAt(0).toUpperCase();
  const createdBy = project.owner?.displayName || "Desconhecido";
  const createdById = project.ownerId;

  const ActualTab = tabComponents[actualTab];

  return (
    <View style={styles.container}>
      <Header
        title="Voltar"
        route={route}
        navigation={navigation as any}
        options={{}}
      />
      <ScrollView
        style={styles.scroll}
        refreshControl={refreshControl}
        {...panResponder.panHandlers}
      >
        <View style={styles.projects}>
          <View style={styles.root}>
            <View style={styles.backgroundContainer}>
              {project.icon ? (
                <View style={styles.iconContainer}>
                  <Image
                    source={{ uri: getCachedImageUrl(project.icon) }}
                    style={styles.iconImage}
                    cachePolicy="memory-disk"
                    contentFit="cover"
                  />
                </View>
              ) : (
                <View
                  style={[styles.iconContainer, styles.iconContainerNoImage]}
                >
                  <Text style={styles.iconText}>{firstLetter}</Text>
                </View>
              )}
              {project.backgroundImage ? (
                <Image
                  source={{ uri: getCachedImageUrl(project.backgroundImage) }}
                  style={styles.backgroundImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              ) : (
                <Text
                  style={styles.backgroundText}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  {project.title.toUpperCase()}
                </Text>
              )}
            </View>
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{project.title}</Text>
                  {project.isOwner && (
                    <ProjectOptions
                      projectId={projectId}
                      projectName={project.title}
                      isDeleting={isDeleting}
                      setIsDeleting={setIsDeleting}
                      onOpenMembersModal={() => setIsMembersModalVisible(true)}
                    />
                  )}
                </View>
                <Text style={styles.createdByContainer}>
                  Criado por:{" "}
                  <Text
                    style={styles.createdBy}
                    onPress={() =>
                      router.push(`/(tabs)/profile/${createdById}`)
                    }
                  >
                    @{createdBy}
                  </Text>
                </Text>
                {project.topFollowers && project.topFollowers.length > 0 && (
                  <View style={styles.topFollowersContainer}>
                    <View style={styles.avatarsContainer}>
                      {project.topFollowers
                        .slice(0, 3)
                        .map((follower, mapIndex) => {
                          const position = mapIndex;
                          return (
                            <View
                              key={`follower-${follower.name}-${position}`}
                              style={[
                                styles.avatar,
                                {
                                  backgroundColor: "#D9D9D9",
                                  marginLeft: position > 0 ? -4 : 0,
                                  zIndex: 3 - position,
                                },
                              ]}
                            >
                              {follower.icon ? (
                                <Image
                                  source={{
                                    uri: getCachedImageUrl(follower.icon),
                                  }}
                                  cachePolicy="memory-disk"
                                  contentFit="cover"
                                  style={styles.avatarImage}
                                />
                              ) : (
                                <Text style={styles.avatarText}>
                                  {follower.name?.charAt(0)?.toUpperCase() ||
                                    "?"}
                                </Text>
                              )}
                            </View>
                          );
                        })}
                    </View>
                    {project.topFollowers[0] && (
                      <Text style={styles.followersText}>
                        {project.followersCount === 1
                          ? `${project.topFollowers[0].name} está seguindo`
                          : `${project.topFollowers[0].name} e mais ${project.followersCount - 1} seguem`}
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <Button
                style={{
                  minWidth: 0,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  alignSelf: "flex-start",
                  width: "auto",
                }}
                onPress={handleFollow}
                disabled={isLoadingFollow}
              >
                <Text style={{ color: Colors.light.white }}>
                  {isFollowing ? "Seguindo" : "Seguir"}
                </Text>
              </Button>
              <View style={styles.separator} />
              <View style={styles.footer}>
                <View style={styles.footerIconContainer}>
                  <Icon name="light-bulb" size={16} color={Colors.light.jet} />
                  <Text style={styles.footerText}>
                    {project.ideasCount} ideias
                  </Text>
                </View>

                <View style={styles.footerIconContainer}>
                  <Icon name="users" size={16} color={Colors.light.jet} />
                  <Text style={styles.footerText}>
                    {project.followersCount} seguidores
                  </Text>
                </View>
              </View>
              <ContentTabs tabs={tabs} tabType="project" />
            </View>
          </View>
          <ActualTab projectId={projectId} description={project.description} />
        </View>
      </ScrollView>
      {project.isOwner && project.members && (
        <ProjectMembersModal
          isVisible={isMembersModalVisible}
          setIsVisible={setIsMembersModalVisible}
          projectId={projectId}
          members={project.members}
          onMemberRemoved={async () => {
            invalidateProjectQuery(projectId);
            invalidateProjectsQuery();
            await refetch();
          }}
        />
      )}
    </View>
  );
}
