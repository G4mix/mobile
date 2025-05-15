import {
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData,
  TextStyle
} from "react-native";
import { forwardRef } from "react";
import { Colors } from "@/constants/colors";

type TextAreaProps = {
  placeholder: string;
  isValid?: "invalid" | "valid" | null;
  onChangeText?: (value: string) => void;
  onFocus?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  returnKeyType?: ReturnKeyTypeOptions;
  style?: StyleProp<TextStyle>;
  value?: string;
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    borderColor: Colors.light.tropicalIndigo,
    borderRadius: 8,
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    padding: 16,
    textAlign: "justify",
    textAlignVertical: "top",
    width: "100%"
  },
  invalid: {
    borderColor: "red",
    color: "red"
  },
  valid: {
    borderColor: "green",
    color: "green"
  }
});

export const TextArea = forwardRef<HTMLInputElement, TextAreaProps>(
  (
    {
      placeholder,
      isValid = null,
      onChangeText,
      onBlur,
      onFocus,
      value,
      onSubmitEditing,
      returnKeyType = "default",
      style = {}
    },
    ref
  ) => (
    <TextInput
      placeholder={placeholder}
      style={[
        styles.input,
        style,
        isValid === "valid" ? styles.valid : {},
        isValid === "invalid" ? styles.invalid : {}
      ]}
      value={value}
      ref={ref as any}
      placeholderTextColor={Colors.light.tropicalIndigo}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      multiline
    />
  )
);
