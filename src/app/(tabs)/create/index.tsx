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
import { CreateScreenCamera } from "@/components/CreateScreen/CreateScreenCamera";
import { CreateScreenImage } from "@/components/CreateScreen/CreateScreenImage";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { objectToFormData } from "@/utils/objectToFormData";
import { PostType } from "@/components/Post";
import { SpinLoading } from "@/components/SpinLoading";
import { useFeedQueries } from "@/hooks/useFeedQueries";
import { CreateScreenEvent } from "@/components/CreateScreen/CreateScreenEvent";
import { getDate } from "@/utils/getDate";
import { isValidPostContent, isValidPostTitle } from "@/constants/validations";
import { RootState } from "@/constants/reduxStore";
import { SuccessModal } from "@/components/SuccessModal";
import { timeout } from "@/utils/timeout";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
    minHeight: Dimensions.get("window").height - 60,
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
    gap: 8,
    justifyContent: "space-between",
    minHeight: 230,
    paddingBottom: 16,
    position: "relative"
  },
  postContentRoot: {
    display: "flex",
    flexDirection: "column"
  },
  scroll: {
    flex: 1,
    marginBottom: 60
  },
  textArea: {
    borderWidth: 0
  }
});

export type CreateScreenFormData = {
  title?: string;
  content?: string;
  images?: { uri: string; name: string; type: string }[];
  links?: string[];
  tags?: string[];
  event?: Partial<PostType["event"]>;
};

export default function CreateScreen() {
  const [isAddLinkVisible, setIsAddLinkVisible] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isAddEventVisible, setIsAddEventVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addNewPost, updatePost } = useFeedQueries();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const user = useSelector((state: RootState) => state.user);

  const { watch, setValue, handleSubmit } = useForm<CreateScreenFormData>();
  const { showToast } = useToast();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  const { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await api.get<PostType>(`/post/${postId}`);
      return response.data;
    },
    enabled: !!postId
  });

  const getPost = () => {
    if (!post) return;
    setValue("title", post.title);
    setValue("content", post.content);
    setValue(
      "images",
      post.images.map((img) => {
        const extension = img.src.split(".").pop()?.split("?")[0] || "jpg";
        return {
          uri: img.src,
          name: img.id,
          type: `image/${extension === "jpg" ? "jpeg" : extension}`
        };
      })
    );
    setValue(
      "links",
      post.links.map((l) => l.url)
    );
    setValue(
      "tags",
      post.tags.map((t) => t.name)
    );
    setValue("event", post.event);
  };

  useEffect(() => {
    getPost();
  }, [post]);

  const createOrUpdatePost = async ({
    title,
    content,
    event,
    images,
    links,
    tags
  }: CreateScreenFormData) => {
    if (isLoading) return;
    if (!title && !content && !images && !links && !event) {
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
      event
    });
    const data = await handleRequest<PostType>({
      requestFn: async () =>
        api[post && postId ? "patch" : "post"](
          `/post${post && postId ? `?postId=${postId}` : ""}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        ),
      showToast,
      setIsLoading
    });
    if (!data) return;
    if (post && postId) {
      updatePost(data);
    } else {
      addNewPost(data);
    }
    setValue("title", undefined);
    (titleRef.current as any).clear();
    setValue("content", undefined);
    (contentRef.current as any).clear();
    setValue("tags", []);
    setValue("images", []);
    setValue("links", []);
    setValue("event", undefined);
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
  const event = watch("event");

  const postContentActions: { name: IconName; handleClick?: () => void }[] = [
    {
      name: "camera",
      handleClick:
        images && images.length >= 8
          ? () =>
              showToast({ message: "O máximo de imagens é 5.", color: "warn" })
          : () => setIsCameraVisible(true)
    },
    {
      name: "chart-bar"
    },
    {
      name: "link",
      handleClick:
        links && links.length >= 5
          ? () =>
              showToast({ message: "O máximo de links é 5.", color: "warn" })
          : () => setIsAddLinkVisible((prevValue) => !prevValue)
    },
    {
      name: "code-bracket"
    },
    {
      name: "calendar",
      handleClick: () => {
        setIsAddEventVisible((prevValue) => !prevValue);
        const actualDate = getDate().toISOString();
        setValue("event", {
          startDate: actualDate,
          endDate: actualDate
        });
      }
    }
  ];

  const handleDeleteImage = (src: string) => {
    const currentImages = images || [];
    setValue(
      "images",
      currentImages.filter((currentImage) => currentImage.uri !== src)
    );
  };

  if (post && post.author.id !== user.userProfile.id) {
    router.push("/feed");
    return null;
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        {isLoading && (
          <SpinLoading message={postId ? "Atualizando..." : "Publicando..."} />
        )}
        {isSuccessVisible && (
          <SuccessModal message={postId ? "Atualizado!" : "Publicado!"} />
        )}
        <CreateScreenHeader
          isLoading={isLoading}
          onSubmit={onSubmit}
          data={{
            title,
            content,
            images,
            links,
            event
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
                : {}
            ]}
          >
            <TextArea
              placeholder="O que você está desenvolvendo? Conte-nos mais!"
              style={[
                styles.textArea,
                isValidPostContent(content) === "invalid"
                  ? { color: "red" }
                  : {}
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
              links={links}
            />
            <CreateScreenCamera
              isCameraVisible={isCameraVisible}
              setIsCameraVisible={setIsCameraVisible}
              setValue={setValue}
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
        <CreateScreenEvent
          isAddEventVisible={isAddEventVisible}
          setValue={setValue}
          watch={watch}
        />
      </View>
    </ScrollView>
  );
}
