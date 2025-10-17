import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";
import { Text } from "./Themed";

type TagProps = {
  onPress?: () => void;
  disabled?: boolean;
  name: string;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
};

export function Tag({
  name,
  onPress,
  disabled = false,
  fontSize,
  style = {},
}: TagProps) {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: Colors.light.majorelleBlue,
          padding: 6,
          borderRadius: 8,
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={{ color: "white", fontSize }}>{name}</Text>
    </TouchableOpacity>
  );
}
