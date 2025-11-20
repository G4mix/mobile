import React, { createContext, useMemo, useState } from "react";
import { ConfirmationModal } from "@/components/ConfirmationModal";

type ConfirmationProps = {
  title: string;
  content: string;
  actionName?: string;
  handleConfirm: () => void;
};

export type ConfirmationModalContextType = {
  showConfirmationModal: (props: ConfirmationProps) => void;
};

export const ConfirmationModalContext = createContext<
  ConfirmationModalContextType | undefined
>(undefined);

type ConfirmationModalProviderProps = { children: React.ReactNode };

export function ConfirmationModalProvider({
  children,
}: ConfirmationModalProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [confirmationModalProps, setConfirmationModalProps] =
    useState<ConfirmationProps>({
      title: "",
      content: "",
      actionName: "",
      handleConfirm: () => undefined,
    });

  const showConfirmationModal = ({
    title,
    content,
    actionName,
    handleConfirm,
  }: ConfirmationProps) => {
    setConfirmationModalProps({
      title,
      content,
      actionName,
      handleConfirm,
    });
    setIsVisible(true);
  };

  const contextValue = useMemo(
    () => ({ showConfirmationModal }),
    [showConfirmationModal],
  );

  return (
    <ConfirmationModalContext.Provider value={contextValue}>
      {children}
      <ConfirmationModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        content={confirmationModalProps.content}
        handleConfirm={confirmationModalProps.handleConfirm}
        title={confirmationModalProps.title}
        actionName={confirmationModalProps.actionName}
      />
    </ConfirmationModalContext.Provider>
  );
}
