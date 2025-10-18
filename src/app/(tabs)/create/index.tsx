import { ScrollView, StyleSheet, Dimensions } from "react-native";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { View } from "@/components/Themed";
import { Colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { useToast } from "@/hooks/useToast";
import { CreateScreenHeader } from "@/components/CreateScreen/CreateScreenHeader";
import { CreateScreenAuthor } from "@/components/CreateScreen/CreateScreenAuthor";
import { CreateScreenTags } from "@/components/CreateScreen/CreateScreenTags";
import { TextArea } from "@/components/TextArea";
import { CreateScreenPostLink } from "@/components/CreateScreen/CreateScreenPostLink";
import { CreateScreenAddLink } from "@/components/CreateScreen/CreateScreenAddLink";
import { CreateScreenContentActions } from "@/components/CreateScreen/CreateScreenContentActions";
import { IconName } from "@/components/Icon";
import { Camera, CameraImage } from "@/components/Camera";
import { CreateScreenImage } from "@/components/CreateScreen/CreateScreenImage";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { objectToFormData } from "@/utils/objectToFormData";
import { IdeaType } from "@/components/Idea";
import { SpinLoading } from "@/components/SpinLoading";
import { useFeedQueries } from "@/hooks/useFeedQueries";
import { isValidPostContent, isValidPostTitle } from "@/constants/validations";
import { RootState } from "@/constants/reduxStore";
import { SuccessModal } from "@/components/SuccessModal";
import { timeout } from "@/utils/timeout";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
    minHeight: Dimensions.get("window").height - 60,
    padding: 20,
  },
  postContent: {
    alignItems: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    borderColor: Colors.light.tropicalIndigo,
    borderRadius: 8,
    borderWidth: 2,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    justifyContent: "space-between",
    minHeight: 230,
    paddingBottom: 16,
    position: "relative",
  },
  postContentRoot: {
    display: "flex",
    flexDirection: "column",
  },
  scroll: {
    flex: 1,
    marginBottom: 60,
  },
  textArea: {
    borderWidth: 0,
  },
});

export type CreateScreenFormData = {
  title?: string;
  content?: string;
  images?: CameraImage[];
  links?: string[];
  tags?: string[];
};

export default function CreateScreen() {
  const [isAddLinkVisible, setIsAddLinkVisible] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addNewIdea, updateIdea } = useFeedQueries();
  const { postId: ideaId } = useLocalSearchParams<{ postId: string }>();
  const user = useSelector((state: RootState) => state.user);

  const { watch, setValue, handleSubmit } = useForm<CreateScreenFormData>();
  const { showToast } = useToast();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  const { data: post } = useQuery({
    queryKey: ["idea", ideaId],
    queryFn: async () => {
      const response = await api.get<IdeaType>(`/idea/${ideaId}`);
      return response.data;
    },
    enabled: !!ideaId,
  });

  const getPost = () => {
    if (!post || !ideaId) return;
    setValue("title", post.title);
    setValue("content", post.content);
    setValue(
      "images",
      post.images.map((img) => {
        const extension = img.src.split(".").pop()?.split("?")[0] || "jpg";
        return {
          uri: img.src,
          name: img.id,
          type: `image/${extension === "jpg" ? "jpeg" : extension}`,
        };
      }),
    );
    setValue("links", post.links);
    setValue("tags", post.tags);
  };

  const clearFields = () => {
    setValue("title", undefined);
    if (titleRef.current) (titleRef.current as any).clear();
    setValue("content", undefined);
    if (contentRef.current) (contentRef.current as any).clear();
    setValue("tags", []);
    setValue("images", []);
    setValue("links", []);
  };

  useEffect(() => {
    getPost();
    return clearFields;
  }, [post, ideaId]);

  const createOrUpdatePost = async ({
    title,
    content,
    images,
    links,
    tags,
  }: CreateScreenFormData) => {
    if (isLoading) return;
    if (!title && !content && !images && !links) {
      showToast({ message: "Você precisa preencher ao menos um campo!" });
      setIsLoading(false);
      return;
    }
    const formData = objectToFormData({
      title,
      content,
      images,
      links,
      tags,
    });

    const data = await handleRequest<IdeaType>({
      requestFn: async () =>
        api[post && ideaId ? "patch" : "post"](
          `/idea${post && ideaId ? `/${ideaId}` : ""}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        ),
      showToast,
      setIsLoading,
    });
    if (!data) return;
    if (post && ideaId) {
      updateIdea(data);
    } else {
      addNewIdea(data);
    }
    clearFields();
    setIsSuccessVisible(true);
    await timeout(1000);
    setIsSuccessVisible(false);
    router.push("/feed");
  };

  const onSubmit = handleSubmit(createOrUpdatePost);

  const title = watch("title");
  const content = watch("content");
  const images = watch("images");
  const links = watch("links");

  const postContentActions: { name: IconName; handleClick?: () => void }[] = [
    {
      name: "camera",
      handleClick:
        images && images.length >= 8
          ? () =>
              showToast({ message: "O máximo de imagens é 5.", color: "warn" })
          : () => setIsCameraVisible(true),
    },
    {
      name: "chart-bar",
    },
    {
      name: "link",
      handleClick:
        links && links.length >= 5
          ? () =>
              showToast({ message: "O máximo de links é 5.", color: "warn" })
          : () => setIsAddLinkVisible((prevValue) => !prevValue),
    },
    {
      name: "code-bracket",
    },
  ];

  const handleDeleteImage = (src: string) => {
    const currentImages = images || [];
    setValue(
      "images",
      currentImages.filter((currentImage) => currentImage.uri !== src),
    );
  };

  if (post && post.author.id !== user.id) {
    router.push("/feed");
    return null;
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        {isLoading && (
          <SpinLoading message={ideaId ? "Atualizando..." : "Publicando..."} />
        )}
        {isSuccessVisible && (
          <SuccessModal message={ideaId ? "Atualizado!" : "Publicado!"} />
        )}
        <CreateScreenHeader
          isLoading={isLoading}
          onSubmit={onSubmit}
          data={{
            title,
            content,
            images,
            links,
          }}
          post={post}
        />
        <CreateScreenAuthor />
        <Input
          placeholder="Qual é o título da sua ideia?"
          color={Colors.light.tropicalIndigo}
          borderWidth={2}
          isValid={isValidPostTitle(title) === "invalid" ? "invalid" : null}
          onChangeText={(value: string) =>
            setValue("title", value.slice(0, 70))
          }
          value={title}
          onSubmitEditing={() => contentRef.current?.focus()}
          returnKeyType="next"
          ref={titleRef}
        />
        <View style={styles.postContentRoot}>
          <View
            style={[
              styles.postContent,
              isValidPostContent(content) === "invalid"
                ? { borderColor: "red" }
                : {},
            ]}
          >
            <TextArea
              placeholder="O que você está desenvolvendo? Conte-nos mais!"
              style={[
                styles.textArea,
                isValidPostContent(content) === "invalid"
                  ? { color: "red" }
                  : {},
              ]}
              ref={contentRef}
              onChangeText={(value: string) =>
                setValue("content", value.slice(0, 700))
              }
            />
            {images?.map((img) => (
              <CreateScreenImage
                key={`post-image-${img.uri}`}
                src={img.uri}
                handleDeleteImage={handleDeleteImage}
              />
            ))}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 8,
                paddingHorizontal: 16,
                flexWrap: "wrap",
              }}
            >
              {links?.map((link) => (
                <CreateScreenPostLink
                  setValue={setValue as any}
                  links={links}
                  link={link}
                  key={`post-link-${link}`}
                />
              ))}
            </View>
            <CreateScreenAddLink
              isAddLinkVisible={isAddLinkVisible}
              setIsAddLinkVisible={setIsAddLinkVisible}
              setValue={setValue}
              links={links}
            />
            <Camera
              isCameraVisible={isCameraVisible}
              setIsCameraVisible={setIsCameraVisible}
              setValue={setValue as any}
              images={images}
            />
          </View>
          <CreateScreenContentActions
            postContentActions={postContentActions}
            style={
              isValidPostContent(content) === "invalid"
                ? { borderColor: "red" }
                : {}
            }
          />
        </View>
        <CreateScreenTags setValue={setValue} watch={watch} />
      </View>
    </ScrollView>
  );
}
