import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Icon } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { UserState } from "@/features/auth/userSlice";
import { formatDate } from "@/utils/formatDate";
import { PostType } from ".";
import { useFloatingOptions } from "@/hooks/useFloatingOptions";
import { handleRequest } from "@/utils/handleRequest";
import { api } from "@/constants/api";
import { useToast } from "@/hooks/useToast";
import { useFeedQueries } from "@/hooks/useFeedQueries";

export const styles = StyleSheet.create({
  firstRow: {
    color: Colors.dark.background,
    display: "flex",
    flexDirection: "row",
    gap: 4,
    justifyContent: "space-between"
  },
  imageProfile: {
    borderRadius: 9999,
    height: 18,
    width: 18
  },
  leftSide: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 4
  },
  postUserInformation: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center"
  },
  userName: {
    fontSize: 13.33,
    fontWeight: "medium"
  }
});

type PostHeaderProps = {
  postId: string;
  author: PostType["author"];
  createdAt: string;
  updatedAt?: string;
};

export function PostHeader({
  postId,
  author,
  createdAt,
  updatedAt
}: PostHeaderProps) {
  const userProfileId = useSelector(
    (state: { user: UserState }) => state.user.userProfile.id
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const { setIsVisible, setOptions, setOptionProps } = useFloatingOptions();
  const { removePost } = useFeedQueries();
  const { showToast } = useToast();

  useEffect(
    () =>
      setOptions([
        {
          name: "Editar",
          iconName: "check",
          onPress: ({ selectedPost }: any) => {
            router.push(`/create?id=${selectedPost}`);
          }
        },
        {
          name: "Deletar",
          iconName: "x-mark",
          onPress: async ({ selectedPost }: any) => {
            if (isDeleting) return;
            await handleRequest({
              requestFn: async () => api.delete(`/post?postId=${selectedPost}`),
              showToast,
              setIsLoading: setIsDeleting
            });
            removePost(selectedPost);
          }
        }
      ]),
    []
  );
  return (
    <View style={styles.firstRow}>
      <View style={styles.leftSide}>
        <View style={styles.postUserInformation}>
          {author.icon ? (
            <Image source={{ uri: author.icon }} style={styles.imageProfile} />
          ) : (
            <Icon size={18} name="user-circle" color={Colors.dark.background} />
          )}
          <Text style={styles.userName}>{author.user.username}</Text>
        </View>
        <Text>•</Text>
        <Text>{formatDate(createdAt, updatedAt)}</Text>
      </View>
      {userProfileId === author.id && (
        <TouchableOpacity
          onPress={() => {
            setIsVisible(true);
            setOptionProps({ selectedPost: postId });
          }}
        >
          <Icon
            size={24}
            name="ellipsis-horizontal"
            color={Colors.dark.background}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
