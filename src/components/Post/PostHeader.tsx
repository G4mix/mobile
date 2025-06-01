import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Dispatch, SetStateAction } from "react";
import { router, usePathname } from "expo-router";
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
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { Option } from "@/context/FloatingOptionsContext";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";

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
  isDeleting: boolean;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
};

export function PostHeader({
  postId,
  author,
  createdAt,
  updatedAt,
  isDeleting,
  setIsDeleting
}: PostHeaderProps) {
  const userProfileId = useSelector(
    (state: { user: UserState }) => state.user.userProfile.id
  );
  const { showConfirmationModal } = useConfirmationModal();
  const { showFloatingOptions } = useFloatingOptions();
  const { removePost, invalidateAllPosts } = useFeedQueries();
  const { showToast } = useToast();
  const pathname = usePathname();

  const options: Option[] = [
    {
      name: "Editar",
      iconName: "check",
      onPress: ({ selectedPost }: any) => {
        router.push(`/create?postId=${selectedPost}`);
      }
    },
    {
      name: "Deletar",
      iconName: "x-mark",
      onPress: async ({ selectedPost }: any) => {
        if (isDeleting) return;
        const handleConfirm = () => {
          handleRequest({
            requestFn: async () => api.delete(`/post?postId=${selectedPost}`),
            showToast,
            setIsLoading: setIsDeleting
          });

          if (pathname.startsWith("/posts")) {
            removePost(selectedPost);
          } else {
            invalidateAllPosts();
          }

          router.push("/feed");
        };

        showConfirmationModal({
          actionName: "Excluir",
          title: "Você realmente deseja apagar a publicação?",
          content:
            "Esta ação não pode ser revertida, certifique-se que realmente deseja excluir a publicação.",
          handleConfirm
        });
      }
    }
  ];

  return (
    <View style={styles.firstRow}>
      <View style={styles.leftSide}>
        <View style={styles.postUserInformation}>
          {author.icon ? (
            <Image
              source={{ uri: getImgWithTimestamp(author.icon) }}
              style={styles.imageProfile}
            />
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
          onPress={() =>
            showFloatingOptions({
              optionProps: { selectedPost: postId },
              options
            })
          }
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
