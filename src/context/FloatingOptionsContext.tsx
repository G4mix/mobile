import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState
} from "react";
import { FloatingOptions } from "@/components/FloatingOptions";
import { IconName } from "@/components/Icon";

type Option = {
  name: string;
  iconName: IconName;
  onPress: (props: any) => void;
};

export type FloatingOptionsContextType = {
  setOptionProps: Dispatch<SetStateAction<object>>;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  setOptions: Dispatch<SetStateAction<Option[]>>;
};

export const FloatingOptionsContext = createContext<
  FloatingOptionsContextType | undefined
>(undefined);

type FloatingOptionsProviderProps = { children: React.ReactNode };

export function FloatingOptionsProvider({
  children
}: FloatingOptionsProviderProps) {
  const [optionProps, setOptionProps] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);

  const contextValue = useMemo(
    () => ({ setOptionProps, setOptions, setIsVisible }),
    [setOptionProps, setOptions, setIsVisible]
  );

  return (
    <FloatingOptionsContext.Provider value={contextValue}>
      {children}
      <FloatingOptions
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={options}
        optionProps={optionProps}
      />
    </FloatingOptionsContext.Provider>
  );
}
