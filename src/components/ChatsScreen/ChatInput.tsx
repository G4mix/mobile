import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Icon } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { ChatModal, styles as chatModalStyles } from "./ChatModal";

export const styles = StyleSheet.create({
  ...chatModalStyles,
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  inputRoot: {
    ...chatModalStyles.inputRoot,
    borderTopWidth: 1,
  },
  root: {
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
});

type ChatInputProps = {
  onMessageSent?: () => void;
};

export function ChatInput({ onMessageSent }: ChatInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.root}>
      <TouchableOpacity
        style={styles.inputRoot}
        onPress={() => setIsVisible(true)}
      >
        <View style={styles.container}>
          <Icon name="face-smile" size={24} />
          <Text style={{ color: Colors.light.russianViolet, fontSize: 16 }}>
            Enviar mensagem
          </Text>
        </View>
        <Icon
          name="paper-airplane"
          size={24}
          color={Colors.light.russianViolet}
          style={{ opacity: 0.7 }}
        />
      </TouchableOpacity>
      <ChatModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        onMessageSent={onMessageSent}
      />
    </View>
  );
}
