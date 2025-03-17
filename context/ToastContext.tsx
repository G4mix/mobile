import { Toast, ToastProps } from "@/components/Toast";
import React, { createContext, useState, useCallback } from "react";
import { View, StyleSheet, Animated } from "react-native";

type ShowToastProps = {
  message: string;
  color?: ToastProps['color'];
  duration?: number;
}

export type ToastContextType = {
  showToast: (props: ShowToastProps) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  
  const showToast = useCallback(({ message, color = "success", duration = 3000 }: ShowToastProps) => {
    const id = Date.now();
    const animation = new Animated.Value(0);

    setToasts((prev) => [...prev, { id, message, color, animation }]);

    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      });
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container}>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} color={toast.color} id={toast.id} animation={toast.animation}/>
        ))}
      </View>
    </ToastContext.Provider>
  );
};



const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  }
});
