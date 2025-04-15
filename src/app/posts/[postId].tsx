import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function PostScreen() {
  const { postId } = useLocalSearchParams();
  return (
    <View>
      <Text>Post</Text>
      <Text>Post ID: {postId}</Text>
    </View>
  );
}
