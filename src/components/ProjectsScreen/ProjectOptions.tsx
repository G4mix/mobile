import { TouchableOpacity } from "react-native";
import { Dispatch, SetStateAction, useState } from "react";
import { router, usePathname } from "expo-router";
import { Icon } from "../Icon";
import { Colors } from "@/constants/colors";
import { useFloatingOptions } from "@/hooks/useFloatingOptions";
import { handleRequest } from "@/utils/handleRequest";
import { api } from "@/constants/api";
import { useToast } from "@/hooks/useToast";
import { useFeedQueries } from "@/hooks/useFeedQueries";
import { Option } from "@/context/FloatingOptionsContext";
import { DeleteProjectModal } from "./DeleteProjectModal";

type ProjectOptionsProps = {
  projectId: string;
  projectName: string;
  isDeleting: boolean;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  onOpenMembersModal?: () => void;
};

export function ProjectOptions({
  projectId,
  projectName,
  isDeleting,
  setIsDeleting,
  onOpenMembersModal,
}: ProjectOptionsProps) {
  const pathname = usePathname();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { showFloatingOptions } = useFloatingOptions();
  const { invalidateProjectsQuery, invalidateProjectQuery } = useFeedQueries();
  const { showToast } = useToast();

  const options: Option[] = [
    ...(onOpenMembersModal
      ? [
          {
            name: "Ver Membros",
            iconName: "users" as const,
            onPress: () => {
              onOpenMembersModal();
            },
          },
        ]
      : []),
    {
      name: "Editar",
      iconName: "pencil",
      onPress: () => {
        router.push(`/(tabs)/projects/${projectId}/edit`);
      },
    },
    {
      name: "Deletar",
      iconName: "x-mark",
      onPress: () => {
        if (isDeleting) return;
        setIsDeleteModalVisible(true);
      },
    },
  ];

  const handleDeleteConfirm = async () => {
    const result = await handleRequest({
      requestFn: async () => api.delete(`/project/${projectId}`),
      showToast,
      setIsLoading: setIsDeleting,
    });

    if (result !== null) {
      invalidateProjectQuery(projectId);
      invalidateProjectsQuery();
      if (!pathname.includes("/projects") || pathname.includes("/projects/")) {
        router.back();
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() =>
          showFloatingOptions({
            optionProps: { selectedProject: projectId },
            options,
          })
        }
      >
        <Icon
          name="ellipsis-vertical"
          size={24}
          color={Colors.light.russianViolet}
        />
      </TouchableOpacity>
      <DeleteProjectModal
        isVisible={isDeleteModalVisible}
        setIsVisible={setIsDeleteModalVisible}
        projectName={projectName}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
