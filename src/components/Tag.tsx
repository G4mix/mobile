import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/colors";
import { Text } from "./Themed";

type TagProps = {
  onPress?: () => void;
  disabled?: boolean;
  name: string;
};

export function Tag({ name, onPress, disabled = false }: TagProps) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.light.majorelleBlue,
        padding: 6,
        borderRadius: 8,
        opacity: disabled ? 0.7 : 1
      }}
      onPress={onPress}
    >
      <Text style={{ color: "white" }}>{name}</Text>
    </TouchableOpacity>
  );
}
