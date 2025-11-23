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

export function CollaborationFeedbackModal({
  isVisible,
  setIsVisible,
  onConfirm,
  isLoading,
  isApproval,
}: {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  onConfirm: (feedback: string) => void;
  isLoading?: boolean;
  isApproval: boolean;
}) {
  const [feedback, setFeedback] = useState("");

  const handleConfirm = () => {
    const finalFeedback = feedback.trim();
    if (finalFeedback.length < 3) {
      return;
    }
    onConfirm(finalFeedback);
    setFeedback("");
  };

  const handleCancel = () => {
    setFeedback("");
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
                    {isApproval ? "Aprovar Solicitação" : "Recusar Solicitação"}
                  </Text>
                  <Text
                    style={{
                      textAlign: "justify",
                      fontSize: 13.33,
                      color: Colors.light.russianViolet,
                    }}
                  >
                    {isApproval
                      ? "Envie um feedback para o solicitante sobre sua aprovação."
                      : "Envie um feedback explicando o motivo da recusa."}
                  </Text>
                </View>
                <TextArea
                  placeholder={
                    isApproval
                      ? "Ex: Bem-vindo à equipe! Estou animado para trabalhar com você."
                      : "Ex: Infelizmente não podemos aceitar sua solicitação no momento."
                  }
                  value={feedback}
                  onChangeText={setFeedback}
                  style={styles.textArea}
                />
                <View style={{ gap: 8 }}>
                  <Button
                    style={{ backgroundColor: Colors.light.majorelleBlue }}
                    onPress={handleConfirm}
                    disabled={isLoading || feedback.trim().length < 3}
                  >
                    <Text style={{ color: Colors.light.background }}>
                      {isLoading
                        ? "Enviando..."
                        : isApproval
                          ? "Aprovar"
                          : "Recusar"}
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
