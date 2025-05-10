import { Pressable } from "react-native";
import { MentionSuggestionsProps } from "react-native-controlled-mentions";
import { FC } from "react";
import { Portal } from "react-native-paper";
import { Text, View } from "./Themed";
import { Colors } from "@/constants/colors";

const suggestions = [
  { id: "1", name: "David Tabaka" },
  { id: "2", name: "Mary" },
  { id: "3", name: "Tony" },
  { id: "4", name: "Mike" },
  { id: "5", name: "Grey" }
];

export const RenderSuggestions: FC<MentionSuggestionsProps> = ({
  keyword,
  onSuggestionPress
}) => {
  if (keyword == null) {
    return null;
  }

  return (
    <Portal>
      <View
        style={{
          bottom: 58,
          position: "absolute",
          width: "100%",
          borderTopWidth: 1,
          borderColor: Colors.light.russianViolet
        }}
      >
        {suggestions
          .filter((one) =>
            one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
          )
          .map((one) => (
            <Pressable
              key={one.id}
              onPress={() => onSuggestionPress(one)}
              style={{ padding: 12 }}
            >
              <Text>{one.name}</Text>
            </Pressable>
          ))}
      </View>
    </Portal>
  );
};
