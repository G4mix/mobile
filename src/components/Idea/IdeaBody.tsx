import { StyleSheet } from "react-native";
import { useState } from "react";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";
import { IdeaType } from ".";
import { Tag } from "../Tag";

const styles = StyleSheet.create({
  postDescription: {
    color: Colors.light.russianViolet,
    fontSize: 13.33,
    textAlign: "justify",
  },
  postDescriptionContainer: {
    borderColor: Colors.light.russianViolet,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  postTitle: {
    color: Colors.light.white,
    fontSize: 27.64,
    fontWeight: "bold",
  },
  seeMore: {
    color: Colors.light.majorelleBlue,
  },
  tag: {
    backgroundColor: "transparent",
  },
  tags: {
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 8,
  },
});

type IdeaBodyProps = {
  author?: string;
  title?: string;
  content?: string;
  images: IdeaType["images"];
  tags?: string[];
};

export function IdeaBody({
  author,
  title,
  content,
  images,
  tags,
}: IdeaBodyProps) {
  const [displayText, setDisplayText] = useState(content);
  const [truncated, setTruncated] = useState(false);

  if (!title && !content && (!images || images.length === 0)) return null;
  return (
    <>
      <Text
        style={{
          flexDirection: "row",
          gap: 8,
          backgroundColor: "transparent",
          color: Colors.light.white,
          fontSize: 19.2,
          lineHeight: 36,
        }}
      >
        {title && <Text style={styles.postTitle}>{title}</Text>} por{"\n"}
        {author && `@${author}`}
      </Text>
      <View style={styles.tags}>
        {(() => {
          const maxVisible = 4;
          const visibleTags = (tags ?? []).slice(0, maxVisible);
          const remaining = (tags?.length ?? 0) - maxVisible;

          return (
            <>
              {visibleTags.map((tag) => (
                <View key={`view-tag-${tag}`} style={styles.tag}>
                  <Tag
                    name={tag}
                    fontSize={13.33}
                    style={{
                      borderRadius: 32,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                    }}
                  />
                </View>
              ))}

              {remaining > 0 && (
                <View style={styles.tag}>
                  <Tag
                    name={`+${remaining}`}
                    fontSize={13.33}
                    style={{
                      borderRadius: 32,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      backgroundColor: Colors.light.majorelleBlue,
                    }}
                  />
                </View>
              )}
            </>
          );
        })()}
      </View>

      <View style={styles.postDescriptionContainer}>
        {content && (
          <Text
            style={styles.postDescription}
            onTextLayout={() => {
              if (content.length > 300 && !truncated && content) {
                const truncatedText = `${content.slice(0, 300).trim()}...`;
                setDisplayText(truncatedText);
                setTruncated(true);
              }
            }}
          >
            {displayText}{" "}
            {truncated && <Text style={styles.seeMore}>ver mais</Text>}
          </Text>
        )}
      </View>
    </>
  );
}
