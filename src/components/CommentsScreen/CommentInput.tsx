import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Icon } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { CommentsModal, styles as commentsModalStyles } from "./CommentsModal";

export const styles = StyleSheet.create({
  ...commentsModalStyles,
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  inputRoot: {
    ...commentsModalStyles.inputRoot,
    backgroundColor: "transparent",
    borderTopWidth: 1
  },
  root: {
    bottom: 0,
    position: "absolute",
    width: "100%"
  }
});

export function CommentInput({ commentsCount }: { commentsCount: number }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleCommentModal = () => {
    setIsVisible(true);
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.inputRoot} onPress={handleCommentModal}>
        <View style={styles.container}>
          <Icon name="face-smile" size={24} />
          <Text style={{ color: Colors.light.russianViolet, fontSize: 16 }}>
            Responder
          </Text>
        </View>
        <Icon
          name="paper-airplane"
          size={24}
          color={Colors.light.russianViolet}
        />
      </TouchableOpacity>
      <CommentsModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        commentsCount={commentsCount}
      />
    </View>
  );
}
