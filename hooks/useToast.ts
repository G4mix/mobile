import { useContext } from "react";
import { ToastContext, ToastContextType } from "@context/ToastContext";

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
};
