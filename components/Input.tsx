import {
  TextInput,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ReturnKeyTypeOptions,
  TextInputSubmitEditingEventData
} from "react-native";
import React, { forwardRef } from "react";
import { Text } from "@/components/Themed";
import { Colors } from "@/constants/colors";
import { Icon, IconName } from "./Icon";

type InputProps = {
  icon: IconName;
  placeholder: string;
  label: string;
  invalidPhrase?: string;
  isPasswordInput?: boolean;
  isValid?: "invalid" | "valid" | null;
  onChangeText?: (value: string) => void;
  onFocus?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderColor: Colors.light.russianViolet,
    borderRadius: 8,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    padding: 12,
    width: "100%"
  },
  errorMessage: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 4,
    paddingLeft: 6
  },
  input: {
    backgroundColor: "transparent",
    color: Colors.light.russianViolet,
    display: "flex",
    flexGrow: 1,
    minHeight: 0,
    padding: 0
  },
  inputLabel: {
    color: Colors.light.russianViolet,
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

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      placeholder,
      icon,
      isValid = null,
      invalidPhrase,
      onChangeText,
      isPasswordInput,
      onBlur,
      onFocus,
      label,
      returnKeyType,
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
          name={icon}
          color={
            isValid === null
              ? Colors.light.russianViolet
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
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor={Colors.light.russianViolet}
          secureTextEntry={isPasswordInput}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={ref as any}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
      {isValid === "invalid" && invalidPhrase && (
        <View style={styles.errorMessage}>
          <Icon size={20} name="exclamation-circle" color={Colors.light.red} />
          <Text style={{ color: Colors.light.red }}>{invalidPhrase}</Text>
        </View>
      )}
    </View>
  )
);
