import { router, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { FloatingOptionsProvider } from "@/context/FloatingOptionsContext";
import { api } from "@/constants/api";
import { Post, PostType } from "@/components/Post";
import { ConfirmationModalProvider } from "@/context/ConfirmationModalContext";
import { Comment } from "@/components/CommentsScreen/Comment";

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
  const comment = null;
  return (
    <View>
      <FloatingOptionsProvider>
        <ConfirmationModalProvider>
          <Post post={post} />
        </ConfirmationModalProvider>
      </FloatingOptionsProvider>
      <View>{comment && <Comment comment={comment} />}</View>
    </View>
  );
}
