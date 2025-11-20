import { StyleSheet, TextInput, View } from "react-native";
import { Icon } from "@/components/Icon";
import { Colors } from "@/constants/colors";

interface SearchHeaderProps {
  onChangeText: (value: string) => void;
  onSubmitEditing: () => void;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderColor: Colors.light.tropicalIndigo,
    borderRadius: 8,
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBlock: 8,
    paddingInline: 16,
    width: "100%",
  },
  header: {
    left: 0,
    padding: 16,
    position: "fixed",
    top: 0,
    width: "100%",
  },
  input: {
    backgroundColor: "transparent",
    display: "flex",
    flexGrow: 1,
    fontSize: 14,
    minHeight: 0,
    padding: 0,
  },
});

export function SearchHeader({
  onChangeText,
  onSubmitEditing,
}: SearchHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <Icon
          size={16}
          name="magnifying-glass"
          color={Colors.light.majorelleBlue}
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 4,
          }}
        />
        <TextInput
          placeholder="O que está buscando?"
          style={styles.input}
          placeholderTextColor={Colors.light.tropicalIndigo}
          onChangeText={onChangeText}
          returnKeyType="default"
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    </View>
  );
}
