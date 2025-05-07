import React, { useEffect, useRef } from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Icon } from "../Icon";
import { Colors } from "@/constants/colors";
import { styles as commentInputStyles } from "./CommentInput";
import { TextArea } from "../TextArea";

const styles = StyleSheet.create({
  ...commentInputStyles,
  inputRoot: {
    ...commentInputStyles.inputRoot,
    backgroundColor: Colors.light.background,
    borderTopWidth: 0
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    flex: 1,
    justifyContent: "flex-end"
  }
});

type CommentsModalProps = {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
};

export function CommentsModal({ isVisible, setIsVisible }: CommentsModalProps) {
  const textAreaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textAreaRef.current) textAreaRef.current.focus();
  }, []);
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback>
            <View style={styles.inputRoot}>
              <View style={styles.container}>
                <Icon name="face-smile" size={24} />
                <TextArea
                  placeholder="Digite seu comentário"
                  style={{
                    color: Colors.dark.background,
                    fontSize: 16,
                    borderWidth: 0,
                    padding: 0,
                    width: "auto",
                    maxWidth: 300
                  }}
                  ref={textAreaRef}
                />
              </View>
              <Icon
                name="paper-airplane"
                size={24}
                color={Colors.light.russianViolet}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
