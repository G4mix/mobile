import { ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { View } from "../Themed";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { Post } from "../Post";
import { PostLoading } from "../Post/PostLoading";
import { InView } from "../InView";
import { useViewPosts } from "@/hooks/useViewPosts";
import { useFeed } from "@/hooks/useFeed";
import { styles } from "@/app/(tabs)/feed";

export function ProfilePosts({ userId }: { userId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed({
    authorId: userId
  });
  const posts = data?.pages?.flatMap((page) => page?.data || []) || [];
  const initialViewedPostIds = posts.filter((p) => p.isViewed).map((p) => p.id);

  const { alreadyVisualized, addVisualizedPost } = useViewPosts({
    initialViewedPostIds
  });

  return (
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
  );
}
