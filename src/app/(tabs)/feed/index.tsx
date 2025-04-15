import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { useRef } from "react";
import { router } from "expo-router";
import { ContentTabs } from "@/components/ContentTabs";
import { Post } from "@/components/Post";
import { useFeed } from "@/hooks/useFeed";
import { InView } from "@/components/InView";
import { useViewPosts } from "@/hooks/useViewPosts";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column"
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

  const posts = data?.pages?.flatMap((page) => page?.data.data || []);
  const { alreadyVisualized, setVisualizedPosts } = useViewPosts();

  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <ContentTabs />
      <ScrollView style={styles.scroll} ref={scrollRef}>
        <View style={styles.posts}>
          <FloatingOptionsProvider>
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
          </FloatingOptionsProvider>
        </View>
      </ScrollView>
    </View>
  );
}
