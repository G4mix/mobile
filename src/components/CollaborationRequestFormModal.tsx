import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { Button } from "./Button";
import { Text } from "./Themed";
import { TextArea } from "./TextArea";
import { Colors } from "@/constants/colors";

const MIN_MESSAGE_LENGTH = 3;
const MAX_MESSAGE_LENGTH = 255;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.russianViolet,
    borderRadius: 20,
    borderWidth: 1,
    gap: 24,
    justifyContent: "center",
    maxWidth: "90%",
    padding: 16,
    width: "100%",
  },
  root: {
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  textArea: {
    minHeight: 100,
  },
});

export function CollaborationRequestFormModal({
  isVisible,
  setIsVisible,
  onConfirm,
  isLoading,
}: {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  onConfirm: (message: string) => void;
  isLoading?: boolean;
}) {
  const [message, setMessage] = useState("");

  const isValidMessage = (value: string) => {
    const trimmed = value.trim();
    return (
      trimmed.length >= MIN_MESSAGE_LENGTH &&
      trimmed.length <= MAX_MESSAGE_LENGTH &&
      /^[^{}]+$/.test(trimmed)
    );
  };

  const isMessageValid = isValidMessage(message);

  const handleConfirm = () => {
    if (!isMessageValid) {
      return;
    }
    const finalMessage = message.trim();
    onConfirm(finalMessage);
    setMessage("");
  };

  const handleCancel = () => {
    setMessage("");
    setIsVisible(false);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.root}>
              <View style={styles.container}>
                <View style={{ gap: 12 }}>
                  <Text
                    style={{
                      textAlign: "justify",
                      fontWeight: "medium",
                      fontSize: 16,
                      color: Colors.light.russianViolet,
                    }}
                  >
                    Solicitar Colaboração
                  </Text>
                  <Text
                    style={{
                      textAlign: "justify",
                      fontSize: 13.33,
                      color: Colors.light.russianViolet,
                    }}
                  >
                    Envie uma mensagem explicando por que você gostaria de
                    colaborar com esta ideia.
                  </Text>
                </View>
                <TextArea
                  placeholder="Ex: Tenho experiência em backend e adoraria ajudar..."
                  value={message}
                  onChangeText={(value) =>
                    setMessage(value.slice(0, MAX_MESSAGE_LENGTH))
                  }
                  style={styles.textArea}
                />
                <View style={{ gap: 8 }}>
                  <Button
                    style={{ backgroundColor: Colors.light.majorelleBlue }}
                    onPress={handleConfirm}
                    disabled={isLoading || !isMessageValid}
                  >
                    <Text style={{ color: Colors.light.background }}>
                      {isLoading ? "Enviando..." : "Enviar Solicitação"}
                    </Text>
                  </Button>
                  <Button onPress={handleCancel} disabled={isLoading}>
                    <Text style={{ color: Colors.light.background }}>
                      Cancelar
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
