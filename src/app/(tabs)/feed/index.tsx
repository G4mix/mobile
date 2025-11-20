import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { Idea } from "@/components/Idea";
import { useFeed } from "@/hooks/useFeed";
import { InView } from "@/components/InView";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { IdeaLoading } from "@/components/Idea/IdeaLoading";
import { Colors } from "@/constants/colors";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { FeedHeader } from "../../../components/FeedHeader";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    minHeight: Dimensions.get("window").height - 60,
  },
  ideas: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 8,
    width: "100%",
  },
  scroll: {
    backgroundColor: Colors.light.background,
    marginBottom: 60,
    width: "100%",
  },
});

export default function FeedScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useFeed();
  const queryClient = useQueryClient();
  const ideas = data?.pages?.flatMap((page) => page?.data || []) || [];

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["ideas"] });
    await refetch();
  };

  const { refreshControl } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  return (
    <View style={styles.container}>
      <FeedHeader />
      <ScrollView style={styles.scroll} refreshControl={refreshControl}>
        <View style={styles.ideas}>
          <FloatingOptionsProvider>
            <ConfirmationModalProvider>
              {ideas?.map((idea, index) => (
                <TouchableOpacity
                  onPress={() => router.push(`/ideas/${idea!.id}` as any)}
                  key={`post-${idea?.id || index}`}
                >
                  <Idea
                    idea={idea}
                    // onInView={() => {
                    //   if (post) addVisualizedPost(post.id);
                    // }}
                    // alreadyVisualized={
                    //   post ? alreadyVisualized.current.has(post.id) : false
                    // }
                  />
                </TouchableOpacity>
              ))}
              {isFetchingNextPage &&
                [1, 2, 3].map((idea) => (
                  <IdeaLoading key={`idea-loading-${idea}`} />
                ))}
              {isFetchingNextPage || !hasNextPage ? null : (
                <InView onInView={fetchNextPage} />
              )}
            </ConfirmationModalProvider>
          </FloatingOptionsProvider>
        </View>
      </ScrollView>
    </View>
  );
}
