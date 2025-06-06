import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { router } from "expo-router";
import { ContentTabs, Tab } from "@/components/ContentTabs";
import { Post } from "@/components/Post";
import { useFeed } from "@/hooks/useFeed";
import { InView } from "@/components/InView";
import { useViewPosts } from "@/hooks/useViewPosts";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { PostLoading } from "@/components/Post/PostLoading";
import { Colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    minHeight: Dimensions.get("window").height - 60
  },
  posts: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    width: "100%"
  },
  scroll: {
    backgroundColor: Colors.light.background,
    marginBottom: 60,
    width: "100%"
  }
});

export default function FeedScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();

  const posts = data?.pages?.flatMap((page) => page?.data || []) || [];

  const initialViewedPostIds = posts.filter((p) => p.isViewed).map((p) => p.id);

  const { alreadyVisualized, addVisualizedPost } = useViewPosts({
    initialViewedPostIds
  });

  const tabs: Tab<"feed">[] = [
    {
      name: "Destaques",
      disabled: true,
      key: "following"
    },
    {
      name: "Recomendações",
      key: "recommendations"
    },
    {
      name: "Seguindo",
      disabled: true,
      key: "highlights"
    }
  ];

  return (
    <View style={styles.container}>
      <ContentTabs tabs={tabs} tabType="feed" />
      <ScrollView style={styles.scroll}>
        <View style={styles.posts}>
          <FloatingOptionsProvider>
            <ConfirmationModalProvider>
              {posts?.map((post, index) => (
                <TouchableOpacity
                  onPress={() => router.push(`/posts/${post!.id}`)}
                  key={`post-${post?.id || index}`}
                >
                  <Post
                    post={post}
                    onInView={() => {
                      if (post) addVisualizedPost(post.id);
                    }}
                    alreadyVisualized={
                      post ? alreadyVisualized.current.has(post.id) : false
                    }
                  />
                </TouchableOpacity>
              ))}
              {isFetchingNextPage &&
                [1, 2, 3].map((post) => (
                  <PostLoading key={`post-loading-${post}`} />
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
