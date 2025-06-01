import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "./Icon";
import { Colors } from "@/constants/colors";

export function Header({
  title,
  navigation
}: NativeStackHeaderProps & { title?: string }) {
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
        position: "relative"
      }}
    >
      <TouchableOpacity
        style={{ top: 16, left: 16, position: "absolute", zIndex: 2 }}
        onPress={() => navigation.goBack()}
      >
        <Icon
          size={24}
          name="chevron-left"
          style={{
            color: Colors.light.russianViolet
          }}
        />
      </TouchableOpacity>
      {title && (
        <Text
          style={{
            fontWeight: 600,
            fontSize: 19.2,
            width: "100%",
            textAlign: "center",
            color: Colors.light.russianViolet
          }}
        >
          {title}
        </Text>
      )}
    </View>
  );
}
