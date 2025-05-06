import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from "react-native";
import { router } from "expo-router";
import { PostType } from ".";
import { Text, View } from "../Themed";

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    maxHeight: 200,
    overflow: "hidden",
    width: "100%"
  },
  half: {
    height: 100,
    resizeMode: "cover",
    width: "50%"
  },
  halfTall: {
    height: 200,
    resizeMode: "cover",
    width: "50%"
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  overlayText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  single: {
    height: 200,
    resizeMode: "cover",
    width: "100%"
  },
  thirdBottom: {
    height: 100,
    resizeMode: "cover",
    width: "100%"
  }
});

type PostImagesProps = {
  images: PostType["images"];
  postId: string;
};

export function PostImages({ images, postId }: PostImagesProps) {
  const imagesCount = images.length;
  const imagesToRender = images.slice(0, 4);

  const getStyle = (index: number) => {
    const stylesArray = [
      styles.single,
      styles.halfTall,
      index < 2 ? styles.half : styles.thirdBottom,
      styles.half
    ];
    return stylesArray[imagesToRender.length - 1];
  };

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    images.length === 1 ? {} : { flexDirection: "row", flexWrap: "wrap" }
  ];

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/posts/[postId]/images", params: { postId } })
      }
    >
      <View style={containerStyle}>
        {imagesToRender.map(({ src, alt, height, width, id }, index) => (
          <View
            key={`post-image-${id}`}
            style={[{ position: "relative" }, getStyle(index)]}
          >
            <Image
              source={{ uri: src }}
              width={width}
              alt={alt}
              height={height}
              style={{ width: "100%", objectFit: "cover", flex: 1 }}
            />
            {index === imagesToRender.length - 1 && imagesCount > 4 && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>+{imagesCount - 4}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}
