import { Text, Animated, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export type ToastProps = {
  // eslint-disable-next-line react/no-unused-prop-types, react/require-default-props
  id: number;
  message: string;
  // eslint-disable-next-line react/no-unused-prop-types, react/require-default-props
  color?: "success" | "error" | "warn";
  animation: Animated.Value;
};

const styles = StyleSheet.create({
  text: {
    color: Colors.light.background,
    fontWeight: "bold"
  },
  toast: {
    borderRadius: 5,
    marginBottom: 8,
    padding: 10
  }
});

export function Toast({ message, animation }: ToastProps) {
  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: Colors.light.russianViolet },
        {
          opacity: animation,
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0]
              })
            }
          ]
        }
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}
