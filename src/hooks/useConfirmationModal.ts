import { useContext } from "react";
import {
  ConfirmationModalContext,
  ConfirmationModalContextType
} from "@/context/ConfirmationModalContext";

export const useConfirmationModal = (): ConfirmationModalContextType => {
  const context = useContext(ConfirmationModalContext);
  if (!context) {
    throw new Error(
      "useConfirmationModal deve ser usado dentro de um ConfirmationModalProvider"
    );
  }
  return context;
};
