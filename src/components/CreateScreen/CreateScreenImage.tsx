import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "../Icon";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";

const styles = StyleSheet.create({
  postContentImage: {
    borderRadius: 8,
    height: "100%",
    objectFit: "cover",
    width: "100%"
  },
  postContentImageCancel: {
    height: 24,
    width: 24
  },
  postContentImageCancelRoot: {
    color: "white",
    height: 24,
    position: "absolute",
    right: 24,
    top: 8,
    width: 24
  },
  postContentImageRoot: {
    borderRadius: 8,
    height: 200,
    paddingLeft: 16,
    paddingRight: 16,
    position: "relative",
    width: "100%"
  }
});

type CreateScreenImageProps = {
  src: string;
  handleDeleteImage: (src: string) => void;
};

export function CreateScreenImage({
  src,
  handleDeleteImage
}: CreateScreenImageProps) {
  return (
    <View style={styles.postContentImageRoot}>
      <Image
        style={styles.postContentImage}
        src={getImgWithTimestamp(src)}
        width={284}
        height={146}
      />
      <TouchableOpacity
        style={styles.postContentImageCancelRoot}
        onPress={() => handleDeleteImage(src)}
      >
        <Icon
          name="x-mark"
          color="white"
          size={24}
          style={styles.postContentImageCancel}
        />
      </TouchableOpacity>
    </View>
  );
}
