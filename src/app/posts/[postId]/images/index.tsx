import { Link, router, useLocalSearchParams } from "expo-router";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/constants/api";
import { PostType } from "@/components/Post";
import { Loading } from "@/components/Loading";
import { Icon } from "@/components/Icon";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
  postImage: {
    objectFit: "cover",
    width: "100%"
  }
});

export default function PostImageScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

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

  return (
    <ScrollView>
      <View style={{ flexDirection: "column", gap: 32 }}>
        {(isLoading || !post) &&
          [0, 1, 2].map((value) => (
            <Loading
              key={`loading-image-${value}`}
              width="100%"
              height={300}
              borderRadius={8}
              style={{
                position: "relative",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon name="photo" size={64} color={Colors.light.background} />
            </Loading>
          ))}
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
