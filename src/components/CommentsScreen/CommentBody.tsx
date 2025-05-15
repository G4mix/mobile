import { StyleSheet } from "react-native";
import { View } from "../Themed";
import { Colors } from "@/constants/colors";
import { RenderText } from "../RenderText";

const styles = StyleSheet.create({
  postDescription: {
    color: Colors.light.russianViolet,
    fontSize: 13.33,
    marginVertical: 8,
    textAlign: "justify"
  }
});

type PostBodyProps = {
  content: string;
};

export function CommentBody({ content }: PostBodyProps) {
  return (
    <View>
      <RenderText style={styles.postDescription} content={content} />
    </View>
  );
}
