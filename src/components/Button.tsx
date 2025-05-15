import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from "react-native";
import { ReactNode } from "react";
import { Colors } from "@/constants/colors";

type ButtonProps = {
  children: ReactNode;
  onPress?: (e?: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
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

export function Button({
  children,
  onPress,
  disabled = false,
  style: buttonStyles
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.root, disabled ? styles.disabled : {}, buttonStyles]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}
