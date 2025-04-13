import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { useRef, useState } from "react";
import { router } from "expo-router";
import { ContentTabs, Tab } from "@/components/ContentTabs";
import { Post } from "@/components/Post";
import { useFeed } from "@/hooks/useFeed";
import { InView } from "@/components/InView";
import { useViewPosts } from "@/hooks/useViewPosts";

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
    marginBottom: 56,
    width: "100%"
  }
});

export default function FeedScreen() {
  const [actualTab, setActualTab] = useState<Tab["key"]>("recommendations");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeed(actualTab);

  const posts = Array.from(
    new Map(
      data?.pages
        ?.flatMap((page) => page?.data || [])
        .map((post) => [post.id, post])
    ).values()
  );

  const { alreadyVisualized, setVisualizedPosts } = useViewPosts(actualTab);

  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <ContentTabs actualTab={actualTab} setActualTab={setActualTab} />
      <ScrollView style={styles.scroll} ref={scrollRef}>
        <View style={styles.posts}>
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
        </View>
        {isFetchingNextPage || !hasNextPage ? null : (
          <InView onInView={fetchNextPage} scrollRef={scrollRef} />
        )}
      </ScrollView>
    </View>
  );
}
