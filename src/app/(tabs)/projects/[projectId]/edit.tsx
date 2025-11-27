import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { ProjectHeader } from "@/components/ProjectsScreen/ProjectHeader";
import { Button } from "@/components/Button";
import { timeout } from "@/utils/timeout";
import { objectToFormData } from "@/utils/objectToFormData";
import { useToast } from "@/hooks/useToast";
import { handleRequest } from "@/utils/handleRequest";
import { api } from "@/constants/api";
import { SpinLoading } from "@/components/SpinLoading";
import { SuccessModal } from "@/components/SuccessModal";
import { getDate } from "@/utils/getDate";
import {
  getCachedImageUrl,
  invalidateImageCache,
} from "@/utils/getCachedImageUrl";
import { Camera } from "@/components/Camera";
import { useProject } from "@/hooks/useProject";
import { ProjectDto } from "@/types/project";
import { useFeedQueries } from "@/hooks/useFeedQueries";

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    minWidth: "auto",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  header: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export type UpdateProjectFormData = {
  title: string;
  description: string;
  icon: {
    uri: string;
    name: string;
    type: string;
  } | null;
  backgroundImage: {
    uri: string;
    name: string;
    type: string;
  } | null;
};

export default function EditProjectScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { data: project, isLoading: isLoadingProject } = useProject(projectId);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { invalidateProjectQuery, invalidateProjectsQuery } = useFeedQueries();
  const [valueKey, setValueKey] = useState<
    "icon" | "backgroundImage" | undefined
  >();

  const { watch, setValue, handleSubmit, reset } =
    useForm<UpdateProjectFormData>({
      defaultValues: {
        title: "",
        description: "",
        icon: null,
        backgroundImage: null,
      },
    });

  useEffect(() => {
    if (project) {
      const extension = (url: string) => {
        const ext = url.split(".").pop()?.split("?")[0] || "png";
        return ext === "jpg" ? "jpeg" : ext;
      };

      const date = getDate().toISOString();

      reset({
        title: project.title || "",
        description: project.description || "",
        backgroundImage: project.backgroundImage
          ? {
              uri: project.backgroundImage,
              name: `backgroundImage-${date}.${extension(project.backgroundImage)}`,
              type: `image/${extension(project.backgroundImage)}`,
            }
          : null,
        icon: project.icon
          ? {
              uri: project.icon,
              name: `project-icon-${date}.${extension(project.icon)}`,
              type: `image/${extension(project.icon)}`,
            }
          : null,
      });
    }
  }, [project?.id]);

  const updateProject = async ({
    title,
    description,
    backgroundImage,
    icon,
  }: UpdateProjectFormData) => {
    if (isLoading || !project) return;
    if (
      project.title === title &&
      project.description === description &&
      project.backgroundImage === backgroundImage?.uri &&
      project.icon === icon?.uri
    ) {
      router.back();
      setIsLoading(false);
      return;
    }

    const formData = objectToFormData({
      title,
      description: description.length > 0 ? description : undefined,
      backgroundImage,
      icon,
    });

    const data = await handleRequest<ProjectDto>({
      requestFn: async () =>
        api.patch(`/project/${projectId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      showToast,
      setIsLoading,
    });
    if (!data) return;

    if (icon?.uri && icon.uri !== project.icon) {
      await invalidateImageCache(icon.uri);
    }
    if (
      backgroundImage?.uri &&
      backgroundImage.uri !== project.backgroundImage
    ) {
      await invalidateImageCache(backgroundImage.uri);
    }
    if (data.icon && data.icon !== project.icon) {
      await invalidateImageCache(data.icon);
    }
    if (
      data.backgroundImage &&
      data.backgroundImage !== project.backgroundImage
    ) {
      await invalidateImageCache(data.backgroundImage);
    }

    invalidateProjectQuery(projectId);
    invalidateProjectsQuery();
    setIsSuccessVisible(true);
    await timeout(1000);
    setIsSuccessVisible(false);
    router.back();
  };

  const onSubmit = handleSubmit(updateProject);

  const title = watch("title");
  const description = watch("description");
  const icon = watch("icon");
  const backgroundImage = watch("backgroundImage");

  const handlePressProjectBackground = () => {
    setValueKey("backgroundImage");
    setIsCameraVisible(true);
  };

  const handlePressProjectIcon = () => {
    setValueKey("icon");
    setIsCameraVisible(true);
  };

  const iconUri = icon?.uri ? getCachedImageUrl(icon.uri) : undefined;
  const bgUri = backgroundImage?.uri
    ? getCachedImageUrl(backgroundImage.uri)
    : undefined;

  if (isLoadingProject) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.light.background,
        }}
      >
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      {isLoading && <SpinLoading message="Atualizando projeto..." />}
      {isSuccessVisible && <SuccessModal message="Projeto atualizado!" />}
      <View
        style={{
          flex: 1,
          position: "relative",
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 12,
        }}
      >
        <View style={styles.header}>
          <Text style={{ fontSize: 16 }}>Editar Projeto</Text>
          <Button style={styles.button} onPress={onSubmit}>
            <Text style={{ color: Colors.light.white, fontSize: 16 }}>
              Salvar
            </Text>
          </Button>
        </View>
        <ProjectHeader
          title={title || project.title}
          icon={iconUri}
          backgroundImage={bgUri}
          onPressBackground={handlePressProjectBackground}
          onPressIcon={handlePressProjectIcon}
        />
        <Input
          placeholder={project.title || "Nome do projeto"}
          label="Título do Projeto"
          labelColor={Colors.light.russianViolet}
          color={Colors.light.tropicalIndigo}
          borderWidth={2}
          value={title}
          onChangeText={(value) => setValue("title", value)}
        />
        <View style={{ gap: 4 }}>
          <Text
            style={{ fontWeight: "bold", color: Colors.light.russianViolet }}
          >
            Descrição
          </Text>
          <TextArea
            placeholder={project.description || "Descreva o seu projeto"}
            value={description}
            onChangeText={(value) => setValue("description", value)}
            style={{ minHeight: 136, color: Colors.light.russianViolet }}
          />
        </View>
        <Camera
          isCameraVisible={isCameraVisible}
          setIsCameraVisible={setIsCameraVisible}
          setValue={setValue as any}
          valueKey={valueKey}
          singleImage
        />
      </View>
    </ScrollView>
  );
}
