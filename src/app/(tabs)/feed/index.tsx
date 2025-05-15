import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { router } from "expo-router";
import { ContentTabs } from "@/components/ContentTabs";
import { Post } from "@/components/Post";
import { useFeed } from "@/hooks/useFeed";
import { InView } from "@/components/InView";
import { useViewPosts } from "@/hooks/useViewPosts";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { PostLoading } from "@/components/Post/PostLoading";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
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
  const { alreadyVisualized, setVisualizedPosts } = useViewPosts();

  return (
    <View style={styles.container}>
      <ContentTabs />
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
                    onInView={() =>
                      post &&
                      !alreadyVisualized.current.has(post.id) &&
                      setVisualizedPosts((oldPosts) => [...oldPosts, post.id])
                    }
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
