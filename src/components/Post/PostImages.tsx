import { Image, StyleSheet } from "react-native";
import { PostType } from ".";
import { View } from "../Themed";

const styles = StyleSheet.create({
  image: {
    objectFit: "cover",
    width: "100%"
  },
  imageRoot: {
    width: "100%"
  },
  imagesRoot: {
    borderRadius: 8,
    gridTemplateColumns: "repeat(2,1fr)",
    gridTemplateRows: "repeat(2,1fr)",
    maxHeight: 150,
    width: "100%"
  }
});

type PostImagesProps = {
  images: PostType["images"];
};

export function PostImages({ images }: PostImagesProps) {
  return (
    <View style={styles.imagesRoot}>
      {images.map(({ src, alt, height, width, id }) => (
        <View style={styles.imageRoot} key={`post-image-${id}`}>
          <Image
            source={{ uri: src }}
            width={width}
            alt={alt}
            height={height}
            style={styles.image}
          />
        </View>
      ))}
    </View>
  );
}
