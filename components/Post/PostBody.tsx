import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";
import { PostImage } from "./PostImage";

const styles = StyleSheet.create({
  postDescription: {
    color: Colors.light.russianViolet,
    fontSize: 13.33,
    marginVertical: 8,
    textAlign: "justify"
  },
  postTitle: {
    color: Colors.light.russianViolet,
    fontSize: 13.33,
    fontWeight: "bold"
  }
});

type PostBodyProps = {
  title?: string;
  content?: string;
};

export function PostBody({ title, content }: PostBodyProps) {
  return (
    <View>
      <Text style={styles.postTitle}>{title}</Text>
      <Text style={styles.postDescription}>{content}</Text>
      <PostImage />
    </View>
  );
}
