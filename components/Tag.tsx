import { Colors } from "@/constants/colors";
import { Text, View } from "./Themed";

type TagProps = {
  name: string;
};

export function Tag({ name }: TagProps) {
  return (
    <View
      style={{
        backgroundColor: Colors.light.majorelleBlue,
        padding: 6,
        borderRadius: 8
      }}
    >
      <Text style={{ color: "white" }}>{name}</Text>
    </View>
  );
}
