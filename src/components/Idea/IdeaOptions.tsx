import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Dispatch, SetStateAction } from "react";
import { router, usePathname } from "expo-router";
import { Icon } from "../Icon";
import { Colors } from "@/constants/colors";
import { UserState } from "@/features/auth/userSlice";
import { IdeaType } from ".";
import { useFloatingOptions } from "@/hooks/useFloatingOptions";
import { handleRequest } from "@/utils/handleRequest";
import { api } from "@/constants/api";
import { useToast } from "@/hooks/useToast";
import { useFeedQueries } from "@/hooks/useFeedQueries";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { Option } from "@/context/FloatingOptionsContext";

type IdeaHeaderProps = {
  ideaId: string;
  author: IdeaType["author"];
  isDeleting: boolean;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
};

export function IdeaOptions({
  ideaId,
  author,
  isDeleting,
  setIsDeleting,
}: IdeaHeaderProps) {
  const userProfileId = useSelector(
    (state: { user: UserState }) => state.user.id,
  );
  const pathname = usePathname();
  const { showConfirmationModal } = useConfirmationModal();
  const { showFloatingOptions } = useFloatingOptions();
  const { invalidateAllIdeas, invalidateIdeaQuery, invalidateUserQuery } =
    useFeedQueries();
  const { showToast } = useToast();

  const options: Option[] = [
    {
      name: "Editar",
      iconName: "pencil",
      onPress: ({ selectedPost }: any) => {
        router.push(`/(tabs)/create?ideaId=${selectedPost}`);
      },
    },
    {
      name: "Deletar",
      iconName: "x-mark",
      onPress: async ({ selectedPost }: any) => {
        if (isDeleting) return;
        const handleConfirm = async () => {
          const result = await handleRequest({
            requestFn: async () => api.delete(`/idea/${selectedPost}`),
            showToast,
            setIsLoading: setIsDeleting,
          });

          if (result) {
            invalidateIdeaQuery(selectedPost);
            invalidateAllIdeas();
            invalidateUserQuery(userProfileId);

            if (pathname.includes("/profile")) {
              const authorId = author?.id;
              if (authorId) {
                router.push(`/(tabs)/profile/${authorId}`);
              } else {
                router.back();
              }
            } else {
              router.back();
            }
          }
        };

        showConfirmationModal({
          actionName: "Excluir",
          title: "Você realmente deseja apagar a publicação?",
          content:
            "Esta ação não pode ser revertida, certifique-se que realmente deseja excluir a publicação.",
          handleConfirm,
        });
      },
    },
  ];

  if (!author || userProfileId !== author.id) return null;
  return (
    <TouchableOpacity
      onPress={() =>
        showFloatingOptions({
          optionProps: { selectedPost: ideaId },
          options,
        })
      }
    >
      <Icon
        size={24}
        name="ellipsis-horizontal"
        color={Colors.dark.background}
      />
    </TouchableOpacity>
  );
}
