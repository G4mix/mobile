import { View, StyleSheet, Modal } from "react-native";
import { Colors } from "@/constants/colors";
import { Text } from "./Themed";
import { Icon } from "./Icon";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 100,
    justifyContent: "center",
    position: "fixed",
    width: "100%",
  },
  icon: {
    alignItems: "center",
    borderColor: Colors.light.majorelleBlue,
    borderRadius: 9999,
    borderWidth: 6,
    height: 96,
    justifyContent: "center",
    width: 96,
  },
  root: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    gap: 16,
    justifyContent: "center",
    position: "fixed",
    width: "100%",
    zIndex: 9999,
  },
  title: {
    color: Colors.light.majorelleBlue,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export function SuccessModal({ message = "Sucesso!" }: { message?: string }) {
  return (
    <Modal style={{ flex: 1 }} animationType="none">
      <View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.icon}>
            <Icon
              name="check"
              size={68}
              color={Colors.light.majorelleBlue}
              style={{
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              }}
            />
          </View>
        </View>
        <Text style={styles.title}>{message}</Text>
      </View>
    </Modal>
  );
}
