/* eslint-disable react-native/no-unused-styles */
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Colors } from "@/constants/colors";
import { Text, View } from "../Themed";

const styles = StyleSheet.create({
  end: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopWidth: 0
  },
  full: {
    borderRadius: 8
  },
  middle: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 1
  },
  root: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 24
  },
  start: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  }
});
export function Option({
  name,
  position,
  onPress,
  color = "russianViolet"
}: {
  name: string;
  position: "start" | "middle" | "end" | "full";
  color?: "russianViolet" | "red";
  onPress?: (event: GestureResponderEvent) => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            ...styles.root,
            borderColor: Colors.light[color === "red" ? "red" : "periwinkle"]
          },
          styles[position]
        ]}
      >
        <Text style={{ color: Colors.light[color], fontSize: 16 }}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}
