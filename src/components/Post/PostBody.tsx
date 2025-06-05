import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";
import { PostImages } from "./PostImages";
import { PostType } from ".";

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
  postId: string;
  images: PostType["images"];
};

export function PostBody({ postId, title, content, images }: PostBodyProps) {
  if (!title && !content && (!images || images.length === 0)) return null;
  return (
    <View>
      {title && <Text style={styles.postTitle}>{title}</Text>}
      {content && <Text style={styles.postDescription}>{content}</Text>}
      <PostImages images={images} postId={postId} />
    </View>
  );
}
