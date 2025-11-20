import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "./Button";
import { Text } from "./Themed";
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
  },
  root: {
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});

export function ConfirmationModal({
  isVisible,
  setIsVisible,
  title,
  content,
  handleConfirm,
  actionName = "Confirmar",
}: {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  content: string;
  title: string;
  actionName?: string;
  handleConfirm: () => void;
}) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
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
                    {title}
                  </Text>
                  <Text
                    style={{
                      textAlign: "justify",
                      fontSize: 13.33,
                      color: Colors.light.russianViolet,
                    }}
                  >
                    {content}
                  </Text>
                </View>
                <View style={{ gap: 8 }}>
                  <Button
                    style={{ backgroundColor: Colors.light.red }}
                    onPress={() => {
                      handleConfirm();
                      setIsVisible(false);
                    }}
                  >
                    <Text style={{ color: Colors.light.background }}>
                      {actionName}
                    </Text>
                  </Button>
                  <Button onPress={() => setIsVisible(false)}>
                    <Text style={{ color: Colors.light.background }}>
                      Cancelar
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
