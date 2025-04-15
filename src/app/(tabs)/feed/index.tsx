import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { useMemo, useRef, useState } from "react";
import { router } from "expo-router";
import { ContentTabs, Tab } from "@/components/ContentTabs";
import { Post } from "@/components/Post";
import { useFeed } from "@/hooks/useFeed";
import { InView } from "@/components/InView";
import { useViewPosts } from "@/hooks/useViewPosts";
import { FloatingOptions } from "@/components/FloatingOptions";
import { IconName } from "@/components/Icon";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "@/hooks/useToast";
import { removePostFromQuery } from "@/features/feed/queries/removePostFromQuery";

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
  const [actualTab, setActualTab] = useState<Tab["key"]>("recommendations");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    lastFetchTime,
    queryClient
  } = useFeed(actualTab);

  const posts = data?.pages?.flatMap((page) => page?.data || []);
  const { showToast } = useToast();
  const { alreadyVisualized, setVisualizedPosts } = useViewPosts(actualTab);

  const scrollRef = useRef<ScrollView>(null);

  const options: {
    name: string;
    iconName: IconName;
    onPress: (props: any) => void;
  }[] = useMemo(
    () => [
      {
        name: "Editar",
        iconName: "check",
        onPress: ({ selectedPost }: any) => {
          router.push(`/create?id=${selectedPost}`);
        }
      },
      {
        name: "Deletar",
        iconName: "x-mark",
        onPress: async ({ selectedPost }: any) => {
          if (isDeleting) return;
          await handleRequest({
            requestFn: async () => api.delete(`/post?postId=${selectedPost}`),
            showToast,
            setIsLoading: setIsDeleting
          });
          removePostFromQuery({
            queryClient,
            actualTab,
            lastFetchTime,
            selectedPost
          });
        }
      }
    ],
    []
  );

  const [selectedPost, setSelectedPost] = useState("");

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
                showOptions={() => {
                  setIsVisible(true);
                  setSelectedPost(post.id);
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
        {isFetchingNextPage || !hasNextPage || isLoading ? null : (
          <InView onInView={fetchNextPage} scrollRef={scrollRef} />
        )}
        <FloatingOptions
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          options={options}
          optionProps={{ selectedPost }}
        />
      </ScrollView>
    </View>
  );
}
