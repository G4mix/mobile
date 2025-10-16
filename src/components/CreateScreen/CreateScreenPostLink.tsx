import { TouchableOpacity } from "react-native";
import { IdeaLink } from "../Idea/IdeaLink";
import { Colors } from "@/constants/colors";
import { Icon } from "../Icon";
import { useToast } from "@/hooks/useToast";

type CreateScreenPostLinkProps = {
  setValue: (key: string, value?: string[]) => void;
  links?: string[];
  link: string;
  noHorizontalPadding?: boolean;
};

export function CreateScreenPostLink({
  setValue,
  links,
  link,
  noHorizontalPadding = false
}: CreateScreenPostLinkProps) {
  const { showToast } = useToast();

  const handleLoadLinkError = () => {
    setValue(
      "links",
      links?.filter(l => l !== link)
    );
    showToast({
      message:
        "Houve um erro ao tentar encontrar informações sobre o link fornecido!",
      color: "error"
    });
  };

  return (
    <IdeaLink
      handleError={() => handleLoadLinkError()}
      url={link}
      noHorizontalPadding={noHorizontalPadding}
    >
      <TouchableOpacity
        onPress={() => {
          setValue(
            "links",
            links?.filter(l => l !== link)
          );
        }}
        style={{
          position: "absolute",
          right: 12,
          top: 12
        }}
      >
        <Icon
          size={24}
          name="x-mark"
          color={Colors.light.tropicalIndigo}
          style={{
            height: 24,
            width: 24,
            display: "flex",
            justifyContent: "center"
          }}
        />
      </TouchableOpacity>
    </IdeaLink>
  );
}
