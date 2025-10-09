/* eslint-disable react-native/no-unused-styles */
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Colors } from "@/constants/colors";
import { Text, View } from "../Themed";
import { Icon, IconName } from "@/components/Icon";

const styles = StyleSheet.create({
  arrowedView: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end"
  },
  end: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopWidth: 0
  },
  full: {
    borderRadius: 8
  },
  middle: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1
  },
  root: {
    alignItems: "center",
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 10,
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
  color = "russianViolet",
  icon = "undefined"
}: {
  name: string;
  position: "start" | "middle" | "end" | "full";
  color?: "russianViolet" | "red";
  icon?: "undefined" | IconName;
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
        {icon !== "undefined" && (
          <Icon size={24} name={icon} color={Colors.light.russianViolet} />
        )}
        <Text style={{ color: Colors.light[color], fontSize: 16 }}>{name}</Text>
        {icon !== "undefined" && (
          <View style={styles.arrowedView}>
            <Icon
              size={24}
              name="chevron-right"
              color={Colors.light.russianViolet}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
