import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Icon } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { CommentsModal } from "./CommentsModal";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  inputRoot: {
    alignItems: "center",
    borderColor: Colors.light.tropicalIndigo,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: "100%"
  },
  root: {
    bottom: 0,
    position: "absolute",
    width: "100%"
  }
});

export function CommentInput() {
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
      <CommentsModal isVisible={isVisible} setIsVisible={setIsVisible} />
    </View>
  );
}
