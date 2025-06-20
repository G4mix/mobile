import React, { createContext, useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Toast, ToastProps } from "@/components/Toast";

type ShowToastProps = {
  message: string;
  color?: ToastProps["color"];
  duration?: number;
};

export type ToastContextType = {
  showToast: (props: ShowToastProps) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    bottom: 50,
    elevation: 999,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 999
  }
});

type ToastProviderProps = { children: React.ReactNode };

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback(
    ({ message, color = "success", duration = 3000 }: ShowToastProps) => {
      const id = Date.now();
      const animation = new Animated.Value(0);

      setToasts((prev) => [...prev, { id, message, color, animation }]);

      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();

      setTimeout(() => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }).start(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        });
      }, duration);
    },
    []
  );

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <View style={styles.container}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            color={toast.color}
            id={toast.id}
            animation={toast.animation}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}
