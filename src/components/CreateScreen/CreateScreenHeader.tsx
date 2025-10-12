import { StyleSheet } from "react-native";
import { Button } from "../Button";
import { Text, View } from "../Themed";
import { CreateScreenFormData } from "@/app/(tabs)/create";
import { isValidPostContent, isValidPostTitle } from "@/constants/validations";
import { IdeaType } from "../Idea";

type CreateScreenHeaderProps = {
  isLoading: boolean;
  onSubmit: () => void;
  data: CreateScreenFormData;
  post?: IdeaType;
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
  onSubmit,
  data: { title, content, images, links },
  post
}: CreateScreenHeaderProps) {
  const isReadyToSubmit = !!(
    isValidPostTitle(title) === "valid" ||
    isValidPostContent(content) === "valid" ||
    (images && images.length > 0) ||
    (links && links.length > 0)
  );

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Nova Postagem</Text>
      <Button
        style={styles.publishButton}
        onPress={!isLoading ? onSubmit : undefined}
        disabled={!isReadyToSubmit || isLoading}
      >
        <Text style={{ color: "white" }}>
          {post ? "Atualizar" : "Publicar"}
        </Text>
      </Button>
    </View>
  );
}
