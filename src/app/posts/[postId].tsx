import { router, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { api } from "@/constants/api";
import { Post, PostType } from "@/components/Post";

export default function PostScreen() {
  const { postId } = useLocalSearchParams();

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
    <View>
      <FloatingOptionsProvider>
        <Post post={post} />
      </FloatingOptionsProvider>
    </View>
  );
}
