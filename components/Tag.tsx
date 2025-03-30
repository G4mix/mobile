import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/colors";
import { Text } from "./Themed";

type TagProps = {
  onPress?: () => void;
  name: string;
};

export function Tag({ name, onPress }: TagProps) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.light.majorelleBlue,
        padding: 6,
        borderRadius: 8
      }}
      onPress={onPress}
    >
      <Text style={{ color: "white" }}>{name}</Text>
    </TouchableOpacity>
  );
}
