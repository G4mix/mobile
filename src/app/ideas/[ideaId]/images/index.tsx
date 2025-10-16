import { Link, router, useLocalSearchParams } from "expo-router";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/constants/api";
import { IdeaType } from "@/components/Idea";
import { Loading } from "@/components/Loading";
import { Icon } from "@/components/Icon";
import { Colors } from "@/constants/colors";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";

const styles = StyleSheet.create({
  ideaImage: {
    objectFit: "cover",
    width: "100%"
  }
});

export default function IdeaImageScreen() {
  const { ideaId } = useLocalSearchParams<{ ideaId: string }>();

  const {
    data: idea,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["idea", ideaId],
    queryFn: async () => {
      const response = await api.get<IdeaType>(`/idea/${ideaId}`);
      return response.data;
    },
    enabled: !!ideaId
  });

  if (isError) router.push("/feed");

  return (
    <ScrollView>
      <View style={{ flexDirection: "column", gap: 32 }}>
        {(isLoading || !idea) &&
          [0, 1, 2].map(value => (
            <Loading
              key={`loading-image-${value}`}
              width="100%"
              height={300}
              borderRadius={8}
              style={{
                position: "relative",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon name="photo" size={64} color={Colors.light.background} />
            </Loading>
          ))}
        {idea?.images.map(({ src, alt, id: imageId }) => (
          <Link
            href={{
              pathname: "/ideas/[ideaId]/images/[imageId]",
              params: { ideaId, imageId }
            }}
            key={`idea-image-${imageId}`}
          >
            <Image
              style={styles.ideaImage}
              source={{ uri: getImgWithTimestamp(src) }}
              width={360}
              height={451}
              alt={alt}
            />
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
