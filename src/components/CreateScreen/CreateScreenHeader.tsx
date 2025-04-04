import { StyleSheet } from "react-native";
import { Button } from "../Button";
import { Text, View } from "../Themed";

type CreateScreenHeaderProps = {
  isLoading: boolean;
  onSubmit: () => void;
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  publishButton: {
    minWidth: 0,
    paddingBottom: 14,
    paddingTop: 14
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export function CreateScreenHeader({
  isLoading,
  onSubmit
}: CreateScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Nova Postagem</Text>
      <Button
        style={styles.publishButton}
        onPress={!isLoading ? onSubmit : undefined}
      >
        <Text style={{ color: "white" }}>Publicar</Text>
      </Button>
    </View>
  );
}
