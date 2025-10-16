import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";
import { IdeaType } from ".";

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

type IdeaBodyProps = {
  title?: string;
  content?: string;
  images: IdeaType["images"];
};

export function IdeaBody({ title, content, images }: IdeaBodyProps) {
  if (!title && !content && (!images || images.length === 0)) return null;
  return (
    <View>
      {title && <Text style={styles.postTitle}>{title}</Text>}
      {content && <Text style={styles.postDescription}>{content}</Text>}
    </View>
  );
}
