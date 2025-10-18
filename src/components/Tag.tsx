import { TouchableOpacity, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";
import { Text, View } from "./Themed";

type TagProps = {
  onPress?: () => void;
  disabled?: boolean;
  name: string;
  fontSize?: number;
  style?: ViewStyle;
  color?: string;
};

export function Tag({
  name,
  onPress,
  disabled = false,
  fontSize,
  color = Colors.light.white,
  style = {},
}: TagProps) {
  const Button = onPress ? TouchableOpacity : View;
  return (
    <Button
      style={{
        backgroundColor: Colors.light.majorelleBlue,
        padding: 6,
        borderRadius: 8,
        opacity: disabled ? 0.7 : 1,
        ...style,
      }}
      onPress={onPress}
    >
      <Text style={{ color, fontSize }}>{name}</Text>
    </Button>
  );
}
