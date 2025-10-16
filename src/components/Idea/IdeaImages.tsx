import React from "react";
import { View, StyleSheet, Dimensions, FlatList, Image } from "react-native";
import { IdeaType } from "@/components/Idea";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    height: 600,
    justifyContent: "center",
    position: "relative",
    width: "100%"
  },
  dot: {
    backgroundColor: "gray",
    borderRadius: 5,
    height: 10,
    marginHorizontal: 5,
    width: 10
  },
  image: {
    resizeMode: "cover",
    width
  },
  paginationContainer: {
    alignSelf: "center",
    bottom: 20,
    flexDirection: "row",
    position: "absolute"
  }
});

export function IdeaImages({
  images,
  enablePagination = false
}: {
  images: IdeaType["images"];
  enablePagination?: boolean;
}) {
  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => `idea-image-${item.id}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={0}
        renderItem={({ item }) => (
          <Image
            source={{ uri: getImgWithTimestamp(item.src) }}
            style={styles.image}
          />
        )}
        getItemLayout={(_data, index) => ({
          length: width,
          offset: width * index,
          index
        })}
      />
      {enablePagination && (
        <View style={styles.paginationContainer}>
          {images.map((img) => (
            <View key={`img-current-${img.id}`} style={styles.dot} />
          ))}
        </View>
      )}
    </View>
  );
}
