import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { useRef } from "react";
import { router } from "expo-router";
import { ContentTabs } from "@/components/ContentTabs";
import { Post } from "@/components/Post";
import { useFeed } from "@/hooks/useFeed";
import { InView } from "@/components/InView";
import { useViewPosts } from "@/hooks/useViewPosts";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";

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
    marginBottom: 60,
    width: "100%"
  }
});

export default function FeedScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();

  const posts = data?.pages?.flatMap((page) => page?.data || []) || [];
  const { alreadyVisualized, setVisualizedPosts } = useViewPosts();

  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <ContentTabs />
      <ScrollView style={styles.scroll} ref={scrollRef}>
        <View style={styles.posts}>
          <FloatingOptionsProvider>
            <ConfirmationModalProvider>
              {posts?.map((post, index) => (
                <TouchableOpacity
                  onPress={() => router.push(`/posts/${post!.id}/index`)}
                  key={`post-${post?.id || index}`}
                >
                  <Post
                    post={post}
                    onInView={() =>
                      post &&
                      !alreadyVisualized.current.has(post.id) &&
                      setVisualizedPosts((oldPosts) => [...oldPosts, post.id])
                    }
                    scrollRef={scrollRef}
                    alreadyVisualized={
                      post ? alreadyVisualized.current.has(post.id) : false
                    }
                  />
                </TouchableOpacity>
              ))}
              {isFetchingNextPage || !hasNextPage ? null : (
                <InView onInView={fetchNextPage} scrollRef={scrollRef} />
              )}
            </ConfirmationModalProvider>
          </FloatingOptionsProvider>
        </View>
      </ScrollView>
    </View>
  );
}
