import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity } from "react-native";
import { ReactNode } from "react";
import { Icon } from "./Icon";
import { Colors } from "@/constants/colors";

export function Header({
  title,
  navigation,
  rightComponent,
  leftComponent,
}: NativeStackHeaderProps & {
  title?: string;
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
}) {
  return (
    <View
      style={{
        minHeight: 56,
        backgroundColor: Colors.light.background,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.majorelleBlue,
        position: "relative",
      }}
    >
      <TouchableOpacity
        style={{ top: 16, left: 16, position: "absolute", zIndex: 2 }}
        onPress={() => navigation.goBack()}
      >
        <Icon
          size={24}
          name="arrow-left"
          style={{
            color: Colors.light.russianViolet,
          }}
        />
      </TouchableOpacity>
      {leftComponent && (
        <View
          style={{
            top: 12,
            left: 56,
            position: "absolute",
            zIndex: 2,
          }}
        >
          {leftComponent}
        </View>
      )}
      {title && (
        <Text
          style={{
            fontWeight: 600,
            fontSize: 19.2,
            width: "100%",
            textAlign: "center",
            color: Colors.light.russianViolet,
          }}
        >
          {title}
        </Text>
      )}
      {rightComponent && (
        <View
          style={{
            top: 22,
            right: 16,
            position: "absolute",
            zIndex: 2,
          }}
        >
          {rightComponent}
        </View>
      )}
    </View>
  );
}
