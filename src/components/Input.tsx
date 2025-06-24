import {
  TextInput,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ReturnKeyTypeOptions,
  TextInputSubmitEditingEventData,
  TouchableOpacity
} from "react-native";
import React, { forwardRef } from "react";
import { Text } from "@/components/Themed";
import { Colors } from "@/constants/colors";
import { Icon, IconName } from "./Icon";

type InputProps = {
  icon?: IconName;
  color?: string;
  placeholder: string;
  label?: string;
  iconRight?: boolean;
  handlePressIcon?: () => void;
  invalidPhrase?: string;
  isPasswordInput?: boolean;
  isValid?: "invalid" | "valid" | null;
  onChangeText?: (value: string) => void;
  onFocus?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  returnKeyType?: ReturnKeyTypeOptions;
  labelColor?: string;
  borderWidth?: number;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  editable?: boolean;
  value?: string;
};

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
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
    display: "flex",
    flexGrow: 1,
    minHeight: 0,
    padding: 0
  },
  inputLabel: {
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
      borderWidth = 1,
      color = Colors.light.russianViolet,
      labelColor,
      icon,
      iconRight = false,
      handlePressIcon,
      isValid = null,
      invalidPhrase,
      onChangeText,
      isPasswordInput,
      onBlur,
      onFocus,
      label,
      returnKeyType,
      onSubmitEditing,
      editable,
      value
    },
    ref
  ) => (
    <View style={styles.root}>
      {label && (
        <Text style={[styles.inputLabel, { color: labelColor || color }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          {
            borderColor: color,
            borderWidth,
            flexDirection: iconRight ? "row-reverse" : "row"
          },
          isValid === "valid" ? styles.valid : {},
          isValid === "invalid" ? styles.invalid : {}
        ]}
      >
        {icon &&
          (handlePressIcon ? (
            <TouchableOpacity onPress={handlePressIcon}>
              <Icon
                size={24}
                name={icon}
                color={
                  isValid === null
                    ? color
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
            </TouchableOpacity>
          ) : (
            <Icon
              size={24}
              name={icon}
              color={
                isValid === null ? color : isValid === "valid" ? "green" : "red"
              }
              style={{
                display: "flex",
                width: 24,
                height: 24,
                justifyContent: "center"
              }}
            />
          ))}
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor={color}
          secureTextEntry={isPasswordInput}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={ref as any}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          editable={editable}
          value={value}
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
