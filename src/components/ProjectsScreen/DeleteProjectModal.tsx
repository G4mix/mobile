import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";
import { Button } from "../Button";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.russianViolet,
    borderRadius: 20,
    borderWidth: 1,
    gap: 24,
    justifyContent: "center",
    padding: 16,
    width: "90%",
  },
  input: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.russianViolet,
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.light.russianViolet,
    padding: 12,
    width: "100%",
  },
  inputContainer: {
    gap: 8,
    width: "100%",
  },
  root: {
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});

type DeleteProjectModalProps = {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  projectName: string;
  onConfirm: () => void;
};

export function DeleteProjectModal({
  isVisible,
  setIsVisible,
  projectName,
  onConfirm,
}: DeleteProjectModalProps) {
  const [inputValue, setInputValue] = useState("");
  const isInputValid = inputValue.trim() === projectName.trim();

  const handleConfirm = () => {
    if (!isInputValid) return;
    onConfirm();
    setInputValue("");
    setIsVisible(false);
  };

  const handleCancel = () => {
    setInputValue("");
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
                    Você realmente deseja apagar o projeto?
                  </Text>
                  <Text
                    style={{
                      textAlign: "justify",
                      fontSize: 13.33,
                      color: Colors.light.russianViolet,
                    }}
                  >
                    Esta ação não pode ser revertida. Para confirmar, digite o
                    nome do projeto:{" "}
                    <Text style={{ fontWeight: "bold" }}>{projectName}</Text>
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o nome do projeto"
                    placeholderTextColor={Colors.light.silver}
                    value={inputValue}
                    onChangeText={setInputValue}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <View style={{ gap: 8 }}>
                  <Button
                    style={{
                      backgroundColor: isInputValid
                        ? Colors.light.red
                        : Colors.light.silver,
                    }}
                    onPress={handleConfirm}
                    disabled={!isInputValid}
                  >
                    <Text style={{ color: Colors.light.background }}>
                      Excluir
                    </Text>
                  </Button>
                  <Button onPress={handleCancel}>
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
