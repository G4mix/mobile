import {
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData
} from "react-native";
import { forwardRef, ReactNode } from "react";
import { Text, View } from "./Themed";
import { Colors } from "@/constants/colors";
import { Icon } from "./Icon";

type TagsProps = {
  children: ReactNode;
  placeholder: string;
  label: string;
  showPlaceholder?: boolean;
  isValid?: "invalid" | "valid" | null;
  onChangeText?: (value: string) => void;
  onFocus?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
};

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderColor: Colors.light.tropicalIndigo,
    borderRadius: 8,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    padding: 12,
    width: "100%"
  },
  input: {
    backgroundColor: "transparent",
    display: "flex",
    flexGrow: 1,
    minHeight: 0,
    padding: 0
  },
  inputLabel: {
    color: Colors.light.majorelleBlue,
    fontWeight: "bold"
  },
  invalid: {
    borderColor: "red"
  },
  root: {
    display: "flex",
    gap: 4,
    width: "100%"
  },
  valid: {
    borderColor: "green"
  }
});

export const Tags = forwardRef<HTMLInputElement, TagsProps>(
  (
    {
      children,
      placeholder,
      isValid = null,
      onChangeText,
      onBlur,
      onFocus,
      label,
      returnKeyType,
      showPlaceholder = true,
      onSubmitEditing
    },
    ref
  ) => (
    <View style={styles.root}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.container,
          isValid === "valid" ? styles.valid : {},
          isValid === "invalid" ? styles.invalid : {}
        ]}
      >
        <Icon
          size={24}
          name="plus-circle"
          color={
            isValid === null
              ? Colors.light.majorelleBlue
              : isValid === "valid"
                ? "green"
                : "red"
          }
          style={{
            display: "flex",
            width: 24,
            height: 24,
            justifyContent: "center"
          }}
        />
        {children}
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor={
            showPlaceholder ? Colors.light.tropicalIndigo : "transparent"
          }
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={ref as any}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    </View>
  )
);
