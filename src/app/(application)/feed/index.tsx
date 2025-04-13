import { StyleSheet, ScrollView, View } from "react-native";
import { useRef, useState } from "react";
import { ContentTabs, Tab } from "@/components/ContentTabs";
import { Post } from "@/components/Post";
import { useFeed } from "@/hooks/useFeed";
import { InView } from "@/components/InView";

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
  }
});

export default function FeedScreen() {
  const [actualTab, setActualTab] = useState<Tab["key"]>("recommendations");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeed(actualTab);
  const posts = data?.pages?.flatMap((page) => page?.data);
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <ContentTabs actualTab={actualTab} setActualTab={setActualTab} />
      <View style={styles.posts}>
        {posts?.map((post, index) => (
          <Post key={`post-${post?.id || index}`} post={post} />
        ))}
      </View>
      {isFetchingNextPage || !hasNextPage ? null : (
        <InView onInView={fetchNextPage} scrollRef={scrollRef} />
      )}
    </View>
  );
}
