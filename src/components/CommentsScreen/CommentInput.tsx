import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Dispatch, SetStateAction } from "react";
import { Icon } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { CommentsModal, styles as commentsModalStyles } from "./CommentsModal";
import { CommentType } from "./Comment";

export const styles = StyleSheet.create({
  ...commentsModalStyles,
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  inputRoot: {
    ...commentsModalStyles.inputRoot,
    borderTopWidth: 1
  },
  root: {
    bottom: 0,
    position: "absolute",
    width: "100%"
  }
});

type CommentInputProps = {
  commentsCount: number;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  replying: {
    parentComment: string;
    toMark: string;
    author?: CommentType["author"];
  };
};

export function CommentInput({
  commentsCount,
  isVisible,
  setIsVisible,
  replying
}: CommentInputProps) {
  return (
    <View style={styles.root}>
      <TouchableOpacity
        style={styles.inputRoot}
        onPress={() => setIsVisible(true)}
      >
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
        replying={replying}
      />
    </View>
  );
}
