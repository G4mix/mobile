import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { Text, View } from "@/components/Themed";
import { Button } from "@/components/Button";
import { Icon, IconName } from "@/components/Icon";
import { styles as postHeaderStyles } from "@/components/Post/PostHeader";
import { RootState } from "@/constants/reduxStore";
import { Colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { Tags } from "@/components/Tags";
import { Tag } from "@/components/Tag";
import { useToast } from "@/hooks/useToast";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
    padding: 20
  },
  header: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  imageProfile: {
    ...postHeaderStyles.imageProfile,
    height: 24,
    width: 24
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
  postContentActionDisabled: {
    opacity: 0.4
  },
  postContentActions: {
    alignContent: "center",
    backgroundColor: Colors.light.majorelleBlue,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: Colors.light.tropicalIndigo,
    borderTopWidth: 2,
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    padding: 16,
    width: "100%"
  },
  postContentRoot: {
    display: "flex",
    flexDirection: "column"
  },
  postUserIcon: {
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }] as any
  },
  postUserIconCircle: {
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: [{ translateX: -9 }, { translateY: -9 }] as any
  },
  postUserInformation: {
    ...postHeaderStyles.postUserInformation,
    justifyContent: "flex-start"
  },
  publishButton: {
    minWidth: 0,
    paddingBottom: 14,
    paddingTop: 14
  },
  recommendedTagsRoot: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  tagsRoot: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%"
  },
  textArea: {
    borderWidth: 0
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  userName: {
    ...postHeaderStyles.userName,
    color: Colors.light.majorelleBlue,
    fontSize: 12,
    fontWeight: "bold"
  }
});

type FormData = {
  title?: string;
  content?: string;
  images?: Blob[];
  links?: string[];
  tags?: string[];
};

export default function CreateScreen() {
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddLinkVisible, setIsAddLinkVisible] = useState(false);
  const [recommendedTags, setRecommendedTags] = useState([
    { name: "Programação", visible: true },
    { name: "Design", visible: true },
    { name: "Sound Design", visible: true },
    { name: "Arte 2D", visible: true },
    { name: "Arte 3D", visible: true },
    { name: "Script", visible: true }
  ]);
  const { watch, setValue, handleSubmit } = useForm<FormData>();
  const { showToast } = useToast();
  const contentRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);

  // onChangeText={(value: string) => setValue("email", value)}
  const createPost = ({ title, content, images, links, tags }: FormData) => {
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

  const tags = watch("tags");

  const postContentActions: { name: IconName; handleClick?: () => void }[] = [
    {
      name: "photo",
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nova Postagem</Text>
        <Button
          style={styles.publishButton}
          onPress={!isLoading ? onSubmit : undefined}
        >
          <Text style={{ color: "white" }}>Publicar</Text>
        </Button>
      </View>
      <View style={styles.postUserInformation}>
        {user.userProfile.icon ? (
          <Image
            source={{ uri: user?.userProfile?.icon }}
            style={styles.imageProfile}
          />
        ) : (
          <View style={{ position: "relative", width: 24, height: 24 }}>
            <Icon
              size={24}
              name="user-circle"
              color={Colors.light.periwinkle}
              style={[
                styles.postUserIcon,
                {
                  zIndex: 1,
                  borderRadius: 9999
                }
              ]}
            />
            <View
              style={[
                styles.postUserIconCircle,
                {
                  width: 18,
                  height: 18,
                  borderRadius: 9999,
                  backgroundColor: Colors.light.majorelleBlue
                }
              ]}
            />
          </View>
        )}
        <Text style={styles.userName}>{user.username}</Text>
      </View>
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
          {isAddLinkVisible && (
            <View style={{ padding: 16 }}>
              <Input
                placeholder="Adicione um link"
                color={Colors.light.tropicalIndigo}
              />
            </View>
          )}
        </View>
        <View style={styles.postContentActions}>
          {postContentActions.map((postContentAction) =>
            postContentAction.handleClick ? (
              <TouchableOpacity
                onPress={postContentAction.handleClick}
                key={`post-content-action-${postContentAction.name}`}
              >
                <Icon name={postContentAction.name} size={20} color="white" />
              </TouchableOpacity>
            ) : (
              <Icon
                key={`post-content-action-${postContentAction.name}`}
                name={postContentAction.name}
                size={20}
                color="white"
                style={styles.postContentActionDisabled}
              />
            )
          )}
        </View>
      </View>
      <View style={styles.tagsRoot}>
        <Tags
          label="Tags"
          placeholder="Adicione tags"
          ref={tagsRef}
          showPlaceholder={tags?.length === 0}
          onSubmitEditing={(e) => {
            const currentTags = tags || [];
            const text = e.nativeEvent.text.trim();
            if (text === "" || currentTags.includes(text)) return;
            if (tagsRef.current) (tagsRef.current as any).clear();
            setValue("tags", [...currentTags, text]);
          }}
          returnKeyType="none"
        >
          {tags &&
            tags.map((tag) => (
              <Tag
                key={`tag-${tag}`}
                name={tag}
                onPress={() => {
                  setValue(
                    "tags",
                    tags.filter((t) => t !== tag)
                  );
                  setRecommendedTags((rTags) =>
                    rTags.map((rt) =>
                      rt.name === tag ? { ...rt, visible: true } : rt
                    )
                  );
                }}
              />
            ))}
        </Tags>
        <View style={styles.recommendedTagsRoot}>
          {recommendedTags.map(
            (recommendedTag) =>
              recommendedTag.visible && (
                <Tag
                  key={`recommended-tag-${recommendedTag.name}`}
                  name={recommendedTag.name}
                  onPress={() => {
                    const currentTags = tags || [];
                    if (currentTags.includes(recommendedTag.name)) return;
                    setRecommendedTags((rTags) =>
                      rTags.map((rt) =>
                        rt.name === recommendedTag.name
                          ? { ...rt, visible: false }
                          : rt
                      )
                    );
                    setValue("tags", [...currentTags, recommendedTag.name]);
                  }}
                />
              )
          )}
        </View>
      </View>
    </View>
  );
}
