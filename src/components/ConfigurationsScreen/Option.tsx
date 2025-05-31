import { Colors } from "@/constants/colors";
import { Text, View } from "../Themed";

export function Option({
  name,
  position,
  color = "russianViolet"
}: {
  name: string;
  position: "start" | "middle" | "end" | "full";
  color?: "russianViolet" | "red";
}) {
  return (
    <View
      style={[
        {
          borderColor: Colors.light[color === "red" ? "red" : "periwinkle"],
          borderWidth: 1,
          paddingHorizontal: 16,
          paddingVertical: 24
        },
        position === "start"
          ? {
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8
            }
          : position === "middle"
            ? {
                borderBottomWidth: 1,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8
              }
            : position === "end"
              ? {
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  borderTopWidth: 0
                }
              : {
                  borderRadius: 8
                }
      ]}
    >
      <Text style={{ color: Colors.light[color], fontSize: 16 }}>{name}</Text>
    </View>
  );
}
