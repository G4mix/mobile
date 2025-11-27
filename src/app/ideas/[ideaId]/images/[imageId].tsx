import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/constants/api";
import { IdeaType } from "@/components/Idea";
import { Loading } from "@/components/Loading";
import { Colors } from "@/constants/colors";
import { Icon } from "@/components/Icon";
import { getCachedImageUrl } from "@/utils/getCachedImageUrl";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: "white",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
  },
  dot: {
    backgroundColor: "gray",
    borderRadius: 5,
    height: 10,
    marginHorizontal: 5,
    width: 10,
  },
  image: {
    resizeMode: "contain",
    width,
  },
  paginationContainer: {
    alignSelf: "center",
    bottom: 20,
    flexDirection: "row",
    position: "absolute",
  },
});

export default function IdeaImageScreen() {
  const { ideaId, imageId } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const {
    data: idea,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["idea", ideaId],
    queryFn: async () => {
      const response = await api.get(`/idea/${ideaId}`);
      return response.data;
    },
    enabled: !!ideaId,
  });

  if (isError)
    return <Text style={{ color: "#fff" }}>Erro ao carregar...</Text>;

  const images: IdeaType["images"] = idea?.images || [];
  const initialImageIndex = images.findIndex((img) => img === imageId);

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  return (
    <View style={styles.container}>
      {(isLoading || !idea) && (
        <Loading
          width="100%"
          height={Dimensions.get("screen").height}
          borderRadius={8}
          style={{
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="photo" size={64} color={Colors.light.background} />
        </Loading>
      )}
      <FlatList
        data={images}
        keyExtractor={(item) => `idea-image-${item}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialImageIndex >= 0 ? initialImageIndex : 0}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        renderItem={({ item }) => (
          <Image
            source={{ uri: getCachedImageUrl(item) }}
            style={styles.image}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        )}
        getItemLayout={(_data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      <View style={styles.paginationContainer}>
        {images.map((img, index: number) => (
          <View
            key={`img-current-${img}`}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}
