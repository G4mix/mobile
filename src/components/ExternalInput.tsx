import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  DimensionValue,
} from "react-native";
import React from "react";
import { Text } from "@/components/Themed";
import { Colors } from "@/constants/colors";

type ExternalInputProps = {
  value: string;
  width?: DimensionValue;
  placeholder?: string;
  color?: string;
  label?: string;
  onPress?: () => void;
  isValid?: "invalid" | "valid" | null;
  onChangeText?: (value: string) => void;
  borderWidth?: number;
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
    width: "100%",
  },
  input: {
    backgroundColor: "transparent",
    display: "flex",
    flexGrow: 1,
    minHeight: 0,
    padding: 0,
  },
  inputLabel: {
    fontWeight: "bold",
  },
  invalid: {
    borderColor: "red",
  },
  root: {
    display: "flex",
    gap: 4,
    width: "100%",
  },
  valid: {
    borderColor: "green",
  },
});

export function ExternalInput({
  value,
  placeholder,
  borderWidth = 1,
  width = "100%",
  color = Colors.light.russianViolet,
  isValid = null,
  onPress,
  onChangeText,
  label,
}: ExternalInputProps) {
  return (
    <View style={[styles.root, { width }]}>
      {label && <Text style={[styles.inputLabel, { color }]}>{label}</Text>}
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.container,
          {
            borderColor: color,
            borderWidth,
          },
          isValid === "valid" ? styles.valid : {},
          isValid === "invalid" ? styles.invalid : {},
        ]}
      >
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          editable={false}
          value={value}
          placeholderTextColor={color}
          onChangeText={onChangeText}
        />
      </TouchableOpacity>
    </View>
  );
}
