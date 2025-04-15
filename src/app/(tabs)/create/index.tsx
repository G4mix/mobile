import { StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { router } from "expo-router";
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
import { CreateScreenCamera } from "@/components/CreateScreen/CreateScreenCamera";
import { CreateScreenImage } from "@/components/CreateScreen/CreateScreenImage";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { objectToFormData } from "@/utils/objectToFormData";
import { PostType } from "@/components/Post";
import { SpinLoading } from "@/components/SpinLoading";
import { addNewPostQuery } from "@/features/feed/queries/addNewPostQuery";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
    padding: 20
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
    gap: 16,
    justifyContent: "center",
    paddingBottom: 16
  },
  postContentRoot: {
    display: "flex",
    flexDirection: "column"
  },
  textArea: {
    borderWidth: 0
  }
});

export type CreateScreenFormData = {
  title?: string;
  content?: string;
  images?: { blob: Blob; uri: string }[];
  links?: string[];
  tags?: string[];
};

export type CreateScreenForm = {
  title?: string;
  content?: string;
  images?: Blob[];
  links?: string[];
  tags?: string[];
};

export default function CreateScreen() {
  const [isAddLinkVisible, setIsAddLinkVisible] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastFetchTime = useSelector((state: any) => state.feed.lastFetchTime);
  const queryClient = useQueryClient();

  const { watch, setValue, handleSubmit } = useForm<CreateScreenFormData>();
  const { showToast } = useToast();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  const createPost = async ({
    title,
    content,
    images,
    links,
    tags
  }: CreateScreenFormData | CreateScreenForm) => {
    if (isLoading) return;
    if (!title && !content && !images && !links) {
      showToast({ message: "Você precisa preencher ao menos um campo!" });
      setIsLoading(false);
      return;
    }

    if (images) images = images.map((img: any) => img.blob);
    const formData = objectToFormData({ title, content, images, links, tags });

    const data = await handleRequest<PostType>({
      requestFn: async () =>
        api.post("/post", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }),
      showToast,
      setIsLoading
    });
    if (!data) return;
    addNewPostQuery({
      actualTab: "recommendations",
      data,
      lastFetchTime,
      queryClient
    })
    router.replace("/feed");
    setValue("title", undefined);
    (titleRef.current as any).clear();
    setValue("content", undefined);
    (contentRef.current as any).clear();
    setValue("tags", []);
    setValue("images", []);
    setValue("links", []);
  };

  const onSubmit = handleSubmit(createPost);

  const postContentActions: { name: IconName; handleClick?: () => void }[] = [
    {
      name: "camera",
      handleClick: () => setIsCameraVisible(true)
    },
    {
      name: "chart-bar"
    },
    {
      name: "link",
      handleClick: () => setIsAddLinkVisible((prevValue) => !prevValue)
    },
    {
      name: "code-bracket"
    }
  ];

  const images = watch("images");
  const links = watch("links");

  const handleDeleteImage = (src: string) => {
    const currentImages = images || [];
    setValue(
      "images",
      currentImages.filter((currentImage) => currentImage.uri !== src)
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && <SpinLoading />}
      <CreateScreenHeader isLoading={isLoading} onSubmit={onSubmit} />
      <CreateScreenAuthor />
      <Input
        placeholder="Qual é o título da sua ideia?"
        color={Colors.light.tropicalIndigo}
        borderWidth={2}
        onChangeText={(value: string) => setValue("title", value)}
        onSubmitEditing={() => contentRef.current?.focus()}
        returnKeyType="next"
        ref={titleRef}
      />
      <View style={styles.postContentRoot}>
        <View style={styles.postContent}>
          <TextArea
            placeholder="O que você está desenvolvendo? Conte-nos mais!"
            style={styles.textArea}
            ref={contentRef}
            onChangeText={(value: string) => setValue("content", value)}
          />
          {images?.map((img) => (
            <CreateScreenImage
              key={`post-image-${img}`}
              src={img.uri}
              handleDeleteImage={handleDeleteImage}
            />
          ))}
          {links?.map((link) => (
            <CreateScreenPostLink
              setValue={setValue}
              links={links}
              link={link}
              key={`post-link-${link}`}
            />
          ))}
          <CreateScreenAddLink
            isAddLinkVisible={isAddLinkVisible}
            setIsAddLinkVisible={setIsAddLinkVisible}
            setValue={setValue}
          />
          <CreateScreenCamera
            isCameraVisible={isCameraVisible}
            setIsCameraVisible={setIsCameraVisible}
            setValue={setValue}
            images={images}
          />
        </View>
        <CreateScreenContentActions postContentActions={postContentActions} />
      </View>
      <CreateScreenTags setValue={setValue} watch={watch} />
    </View>
  );
}
