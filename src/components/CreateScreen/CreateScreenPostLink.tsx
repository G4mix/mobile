import { TouchableOpacity } from "react-native";
import { IdeaLink } from "../Idea/IdeaLink";
import { Icon } from "../Icon";
import { View } from "../Themed";

type CreateScreenPostLinkProps = {
  setValue: (key: string, value?: string[]) => void;
  links?: string[];
  link: string;
};

export function CreateScreenPostLink({
  setValue,
  links,
  link,
}: CreateScreenPostLinkProps) {
  return (
    <View
      style={{
        display: "flex",
        gap: 4,
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        paddingRight: 16,
      }}
    >
      <View style={{ width: "100%" }}>
        <IdeaLink url={link} />
      </View>
      <TouchableOpacity
        onPress={() => {
          setValue(
            "links",
            links?.filter((l) => l !== link),
          );
        }}
      >
        <Icon name="x-mark" />
      </TouchableOpacity>
    </View>
  );
}
