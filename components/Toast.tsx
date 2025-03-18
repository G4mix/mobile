import { Colors } from "@/constants/colors";
import { Text, Animated, StyleSheet } from "react-native";

export type ToastProps = {
  id: number;
  message: string;
  color?: 'success' | 'error' | 'warn';
  animation: Animated.Value
};


export const Toast = ({ message, animation }: ToastProps) => {
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
                outputRange: [-100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  text: {
    color: Colors['light'].background,
    fontWeight: "bold",
  },
});
