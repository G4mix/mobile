import { Dispatch, SetStateAction, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";
import { Colors } from "@/constants/colors";
import { Input } from "../Input";
import { View } from "../Themed";
import { CreateScreenFormData } from "@/app/(tabs)/create";

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
  const handleSubmit = (e: any) => {
    if (links && links.length >= 5) {
      setIsAddLinkVisible(false);
      return;
    }
    const currentLinks = links || [];
    const url = e.nativeEvent.text.trim();
    if (url === "" || currentLinks.includes(url)) return;
    if (addLinkRef.current) (addLinkRef.current as any).clear();
    setValue("links", [...currentLinks, url]);
    setIsAddLinkVisible(false);
  };

  if (!isAddLinkVisible) return null;
  return (
    <View
      style={{
        paddingRight: 16,
        paddingLeft: 16,
        opacity: links && links.length >= 5 ? 0.7 : 1
      }}
    >
      <Input
        placeholder="Adicione um link"
        color={Colors.light.tropicalIndigo}
        icon="x-mark"
        iconRight
        handlePressIcon={() => {
          if (addLinkRef.current) (addLinkRef.current as any).clear();
          setIsAddLinkVisible(false);
        }}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        ref={addLinkRef}
      />
    </View>
  );
}
