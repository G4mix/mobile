import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  Animated
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/constants/api";
import { PostType } from "@/components/Post";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: "white"
  },
  container: {
    alignItems: "center",
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center"
  },
  dot: {
    backgroundColor: "gray",
    borderRadius: 5,
    height: 10,
    marginHorizontal: 5,
    width: 10
  },
  image: {
    resizeMode: "contain",
    width
  },
  paginationContainer: {
    alignSelf: "center",
    bottom: 20,
    flexDirection: "row",
    position: "absolute"
  }
});

export default function PostImageScreen() {
  const { postId, imageId } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const {
    data: post,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await api.get(`/post/${postId}`);
      return response.data;
    },
    enabled: !!postId
  });

  if (isError)
    return <Text style={{ color: "#fff" }}>Erro ao carregar...</Text>;
  if (isLoading) return <Text style={{ color: "#fff" }}>Carregando...</Text>;

  const images: PostType["images"] = post?.images || [];
  const initialImageIndex = images.findIndex((img) => img.id === imageId);

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => `post-image-${item.id}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialImageIndex >= 0 ? initialImageIndex : 0}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <Image source={{ uri: item.src }} style={styles.image} />
        )}
        getItemLayout={(_data, index) => ({
          length: width,
          offset: width * index,
          index
        })}
        onScrollToIndexFailed={(info) => {
          console.warn("Erro ao navegar para o índice:", info);
        }}
      />
      <View style={styles.paginationContainer}>
        {images.map((img, index: number) => (
          <View
            key={`img-current-${img.id}`}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}
