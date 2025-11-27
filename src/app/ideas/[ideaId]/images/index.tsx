import { Link, router, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/constants/api";
import { IdeaType } from "@/components/Idea";
import { Loading } from "@/components/Loading";
import { Icon } from "@/components/Icon";
import { Colors } from "@/constants/colors";
import { getCachedImageUrl } from "@/utils/getCachedImageUrl";

const styles = StyleSheet.create({
  ideaImage: {
    objectFit: "cover",
    width: "100%",
  },
});

export default function IdeaImageScreen() {
  const { ideaId } = useLocalSearchParams<{ ideaId: string }>();

  const {
    data: idea,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["idea", ideaId],
    queryFn: async () => {
      const response = await api.get<IdeaType>(`/idea/${ideaId}`);
      return response.data;
    },
    enabled: !!ideaId,
  });

  if (isError) router.push("/feed");

  return (
    <ScrollView>
      <View style={{ flexDirection: "column", gap: 32 }}>
        {(isLoading || !idea) &&
          [0, 1, 2].map((value) => (
            <Loading
              key={`loading-image-${value}`}
              width="100%"
              height={300}
              borderRadius={8}
              style={{
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="photo" size={64} color={Colors.light.background} />
            </Loading>
          ))}
        {idea?.images.map((src) => (
          <Link
            href={{
              pathname: "/ideas/[ideaId]/images/[imageId]",
              params: { ideaId, imageId: src },
            }}
            key={`idea-image-${src}`}
          >
            <Image
              style={[styles.ideaImage, { width: 360, height: 451 }]}
              source={{ uri: getCachedImageUrl(src) }}
              cachePolicy="memory-disk"
              contentFit="cover"
            />
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
