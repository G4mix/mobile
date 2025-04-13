import { StyleSheet, View } from "react-native";
import { useRef, useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Tag } from "../Tag";
import { Tags } from "../Tags";
import { CreateScreenFormData } from "@/app/(application)/create";

const styles = StyleSheet.create({
  recommendedTagsRoot: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  tagsRoot: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%"
  }
});

type CreateScreenTagsProps = {
  setValue: UseFormSetValue<CreateScreenFormData>;
  watch: UseFormWatch<CreateScreenFormData>;
};

export function CreateScreenTags({ setValue, watch }: CreateScreenTagsProps) {
  const [recommendedTags, setRecommendedTags] = useState([
    { name: "Programação", visible: true },
    { name: "Design", visible: true },
    { name: "Sound Design", visible: true },
    { name: "Arte 2D", visible: true },
    { name: "Arte 3D", visible: true },
    { name: "Script", visible: true }
  ]);
  const tagsRef = useRef<HTMLInputElement>(null);
  const tags = watch("tags");

  return (
    <View style={styles.tagsRoot}>
      <Tags
        label="Tags"
        placeholder="Adicione tags"
        ref={tagsRef}
        showPlaceholder={tags?.length === 0}
        onSubmitEditing={(e) => {
          const currentTags = tags || [];
          const text = e.nativeEvent.text.trim();
          if (text === "" || currentTags.includes(text)) return;
          if (tagsRef.current) (tagsRef.current as any).clear();
          setValue("tags", [...currentTags, text]);
        }}
        returnKeyType="none"
      >
        {tags &&
          tags.map((tag) => (
            <Tag
              key={`tag-${tag}`}
              name={tag}
              onPress={() => {
                setValue(
                  "tags",
                  tags.filter((t) => t !== tag)
                );
                setRecommendedTags((rTags) =>
                  rTags.map((rt) =>
                    rt.name === tag ? { ...rt, visible: true } : rt
                  )
                );
              }}
            />
          ))}
      </Tags>
      <View style={styles.recommendedTagsRoot}>
        {recommendedTags.map(
          (recommendedTag) =>
            recommendedTag.visible && (
              <Tag
                key={`recommended-tag-${recommendedTag.name}`}
                name={recommendedTag.name}
                onPress={() => {
                  const currentTags = tags || [];
                  if (currentTags.includes(recommendedTag.name)) return;
                  setRecommendedTags((rTags) =>
                    rTags.map((rt) =>
                      rt.name === recommendedTag.name
                        ? { ...rt, visible: false }
                        : rt
                    )
                  );
                  setValue("tags", [...currentTags, recommendedTag.name]);
                }}
              />
            )
        )}
      </View>
    </View>
  );
}
