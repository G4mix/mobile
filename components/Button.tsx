import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { Text } from "@/components/Themed";
import { Colors } from "@/constants/colors";

type ButtonProps = {
  children: ReactNode;
  onPress?: (e?: GestureResponderEvent) => void;
  disabled?: boolean;
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.7
  },
  root: {
    alignItems: "center",
    backgroundColor: Colors.dark.majorelleBlue,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    minWidth: "100%",
    padding: 16
  }
});

export function Button({ children, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable
      style={[styles.root, disabled ? styles.disabled : {}]}
      onPress={onPress}
    >
      <Text style={{ color: Colors.dark.text }}>{children}</Text>
    </Pressable>
  );
}
