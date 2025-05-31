import { TouchableOpacity } from "react-native";
import { UseFormSetValue } from "react-hook-form";
import { PostLink } from "../Post/PostLink";
import { Colors } from "@/constants/colors";
import { Icon } from "../Icon";
import { useToast } from "@/hooks/useToast";
import { CreateScreenFormData } from "@/app/(tabs)/create";

type ProfileLink = {
  setValue: UseFormSetValue<CreateScreenFormData>;
  links?: string[];
  link: string;
};

export function ProfileLink({ setValue, links, link }: ProfileLink) {
  const { showToast } = useToast();

  const handleLoadLinkError = () => {
    setValue(
      "links",
      links?.filter((l) => l !== link)
    );
    showToast({
      message:
        "Houve um erro ao tentar encontrar informações sobre o link fornecido!",
      color: "error"
    });
  };

  return (
    <PostLink
      handleError={() => handleLoadLinkError()}
      url={link}
      noHorizontalPadding
    >
      <TouchableOpacity
        onPress={() => {
          setValue(
            "links",
            links?.filter((l) => l !== link)
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
    </PostLink>
  );
}
