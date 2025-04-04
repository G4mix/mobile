import { StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
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
    justifyContent: "center"
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
  images?: Blob[];
  links?: string[];
  tags?: string[];
};

export default function CreateScreen() {
  const [isAddLinkVisible, setIsAddLinkVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { watch, setValue, handleSubmit } = useForm<CreateScreenFormData>();
  const { showToast } = useToast();
  const contentRef = useRef<HTMLInputElement>(null);

  const createPost = ({
    title,
    content,
    images,
    links,
    tags
  }: CreateScreenFormData) => {
    if (isLoading) return;
    if (!title && !content && !images && !links) {
      showToast({ message: "Você precisa preencher ao menos um campo!" });
      setIsLoading(false);
      return;
    }
    // eslint-disable-next-line no-console
    console.log({ title, content, images, links, tags });
  };

  const onSubmit = handleSubmit(createPost);

  const postContentActions: { name: IconName; handleClick?: () => void }[] = [
    {
      name: "camera",
      handleClick: () => undefined
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

  const links = watch("links");

  return (
    <View style={styles.container}>
      <CreateScreenHeader isLoading={isLoading} onSubmit={onSubmit} />
      <CreateScreenAuthor />
      <Input
        placeholder="Qual é o título da sua ideia?"
        color={Colors.light.tropicalIndigo}
        borderWidth={2}
        onChangeText={(value: string) => setValue("title", value)}
        onSubmitEditing={() => contentRef.current?.focus()}
        returnKeyType="next"
      />
      <View style={styles.postContentRoot}>
        <View style={styles.postContent}>
          <TextArea
            placeholder="O que você está desenvolvendo? Conte-nos mais!"
            style={styles.textArea}
            ref={contentRef}
            onChangeText={(value: string) => setValue("content", value)}
          />
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
        </View>
        <CreateScreenContentActions postContentActions={postContentActions} />
      </View>
      <CreateScreenTags setValue={setValue} watch={watch} />
    </View>
  );
}
