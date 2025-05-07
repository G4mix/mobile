import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";

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
      <Text style={styles.postDescription}>{content}</Text>
    </View>
  );
}
