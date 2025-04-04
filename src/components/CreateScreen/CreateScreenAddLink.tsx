import { Dispatch, SetStateAction, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";
import { Colors } from "@/constants/colors";
import { Input } from "../Input";
import { View } from "../Themed";
import { CreateScreenFormData } from "@/app/application/create";

type CreateScreenAddLinkProps = {
  isAddLinkVisible: boolean;
  setIsAddLinkVisible: Dispatch<SetStateAction<boolean>>;
  setValue: UseFormSetValue<CreateScreenFormData>;
  links?: string[];
};

export function CreateScreenAddLink({
  isAddLinkVisible,
  setIsAddLinkVisible,
  setValue,
  links
}: CreateScreenAddLinkProps) {
  const addLinkRef = useRef<HTMLInputElement>(null);

  if (!isAddLinkVisible) return null;
  return (
    <View style={{ padding: 16 }}>
      <Input
        placeholder="Adicione um link"
        color={Colors.light.tropicalIndigo}
        icon="x-mark"
        iconRight
        handlePressIcon={() => {
          if (addLinkRef.current) (addLinkRef.current as any).clear();
          setIsAddLinkVisible(false);
        }}
        onSubmitEditing={(e) => {
          const currentLinks = links || [];
          const url = e.nativeEvent.text.trim();
          if (url === "" || currentLinks.includes(url)) return;
          if (addLinkRef.current) (addLinkRef.current as any).clear();
          setValue("links", [...currentLinks, url]);
          setIsAddLinkVisible(false);
        }}
        returnKeyType="done"
        ref={addLinkRef}
      />
    </View>
  );
}
