import { Link, router, useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/constants/api";
import { PostType } from "@/components/Post";

const styles = StyleSheet.create({
  postImage: {
    objectFit: "cover",
    width: "100%"
  }
});

export default function PostImageScreen() {
  const { postId } = useLocalSearchParams<{ postId: string; }>();

  const {
    data: post,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await api.get<PostType>(`/post/${postId}`);
      return response.data;
    },
    enabled: !!postId
  });

  if (isError) router.push("/feed");
  if (isLoading) return <Text>Carregando...</Text>;

  return (
    <ScrollView>
      <View style={{ flexDirection: "column", gap: 32 }}>
        {post?.images.map(({ src, alt, height, width, id: imageId }) => (
          <Link
            href={{
              pathname: "/posts/[postId]/images/[imageId]",
              params: { postId, imageId }
            }}
            key={`post-image-${imageId}`}
          >
            <Image
              style={styles.postImage}
              source={{ uri: src }}
              width={width}
              height={height}
              alt={alt}
            />
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
