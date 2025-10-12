import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from "react-native";
import { router } from "expo-router";
import { IdeaType } from ".";
import { Text, View } from "../Themed";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";

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

type IdeaImagesProps = {
  images: IdeaType["images"];
  ideaId: string;
};

export function IdeaImages({ images, ideaId }: IdeaImagesProps) {
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
        router.push({
          pathname: "/ideas/[ideaId]/images",
          params: { ideaId }
        })
      }
    >
      <View style={containerStyle}>
        {imagesToRender.map(({ src, alt, id }, index) => (
          <View
            key={`post-image-${id}`}
            style={[{ position: "relative" }, getStyle(index)]}
          >
            <Image
              source={{ uri: getImgWithTimestamp(src) }}
              width={360}
              alt={alt}
              height={451}
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
