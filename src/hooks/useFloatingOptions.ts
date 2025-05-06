import { useContext } from "react";
import {
  FloatingOptionsContextType,
  FloatingOptionsContext
} from "@/context/FloatingOptionsContext";

export const useFloatingOptions = (): FloatingOptionsContextType => {
  const context = useContext(FloatingOptionsContext);
  if (!context) {
    throw new Error(
      "useFloatingOptions deve ser usado dentro de um FloatingOptionsProvider"
    );
  }
  return context;
};
