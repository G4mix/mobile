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
import { Colors } from "@/constants/colors";

type TextAreaProps = {
  placeholder: string;
  isPasswordInput?: boolean;
  isValid?: "invalid" | "valid" | null;
  onChangeText?: (value: string) => void;
  onFocus?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  style?: StyleProp<TextStyle>;
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    borderColor: Colors.light.tropicalIndigo,
    borderRadius: 8,
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    minHeight: 230,
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

export default function TextArea({
  placeholder,
  isValid = null,
  onChangeText,
  isPasswordInput,
  onBlur,
  onFocus,
  returnKeyType,
  onSubmitEditing,
  style = {}
}: TextAreaProps) {
  return (
    <TextInput
      placeholder={placeholder}
      style={[
        styles.input,
        style,
        isValid === "valid" ? styles.valid : {},
        isValid === "invalid" ? styles.invalid : {}
      ]}
      placeholderTextColor={Colors.light.tropicalIndigo}
      secureTextEntry={isPasswordInput}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      multiline
    />
  );
}
