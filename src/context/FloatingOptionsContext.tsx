import React, { createContext, useMemo, useState } from "react";
import { FloatingOptions } from "@/components/FloatingOptions";
import { IconName } from "@/components/Icon";

type Option = {
  name: string;
  iconName: IconName;
  onPress: (props: any) => void;
};

export type FloatingOptionsContextType = {
  showFloatingOptions: ({
    options,
    optionProps
  }: {
    options: Option[];
    optionProps: object;
  }) => void;
};

export const FloatingOptionsContext = createContext<
  FloatingOptionsContextType | undefined
>(undefined);

type FloatingOptionsProviderProps = { children: React.ReactNode };

export function FloatingOptionsProvider({
  children
}: FloatingOptionsProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingOptionsProps, setFloatingOptionsProps] = useState<{
    options: Option[];
    optionProps: object;
  }>({
    optionProps: {},
    options: []
  });

  const showFloatingOptions = ({
    options,
    optionProps
  }: {
    options: Option[];
    optionProps: object;
  }) => {
    setFloatingOptionsProps({
      options,
      optionProps
    });
    setIsVisible(true);
  };

  const contextValue = useMemo(
    () => ({ showFloatingOptions }),
    [showFloatingOptions]
  );

  return (
    <FloatingOptionsContext.Provider value={contextValue}>
      {children}
      <FloatingOptions
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={floatingOptionsProps.options}
        optionProps={floatingOptionsProps.optionProps}
      />
    </FloatingOptionsContext.Provider>
  );
}
