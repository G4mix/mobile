import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";
import { IdeaType } from ".";
import { LinearGradient } from "expo-linear-gradient";
import { Tag } from "../Tag";

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)", 
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  postTitle: {
    color: Colors.light.white,
    fontSize: 27.64,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  authorName: {
    color: Colors.light.white,
    fontSize: 19.2,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    paddingTop: 8.44
  },
  postDescription: {
    color: Colors.light.white,
    fontSize: 13.33,
    marginTop: 8,
    textAlign: "justify",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tag: {
    backgroundColor: "transparent",
  },
  tags: {
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    marginBottom: 16
  }
});

type IdeaBodyProps = {
  author?: string;
  title?: string;
  content?: string;
  images: IdeaType["images"];
  tags?: string[];
};

export function IdeaBody({ author, title, content, images, tags }: IdeaBodyProps) {
  if (!title && !content && (!images || images.length === 0)) return null;
  return (
    <View style={styles.overlayContainer}>
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        locations={[0.3, 0.8]}
        style={styles.gradient}
      />
      <View style={{ flexDirection: "row", gap: 8, backgroundColor: "transparent" }}>
        {title && <Text style={styles.postTitle}>{title}</Text>}
        <Text style={styles.authorName}>por</Text>
      </View>
      {author && <Text style={styles.authorName}>@{author}</Text>}
      <View style={styles.tags}>
        {(tags ?? []).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Tag name={tag}></Tag>
          </View>
        ))}
      </View>
      {content && <Text style={styles.postDescription}>{content}{tags}</Text>}
    </View>
  );
}
