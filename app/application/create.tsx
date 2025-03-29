import { StyleSheet, Image } from "react-native";
import { useSelector } from "react-redux";
import { Text, View } from "@/components/Themed";
import { Button } from "@/components/Button";
import { Icon, IconName } from "@/components/Icon";
import { styles as postHeaderStyles } from "@/components/Post/PostHeader";
import { RootState } from "@/constants/reduxStore";
import { Colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import TextArea from "@/components/TextArea";
import { Tags } from "@/components/Tags";
import { Tag } from "@/components/Tag";

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
    borderTopWidth: 0,
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    padding: 16,
    width: "100%"
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
    gap: 6
  },
  tagsRoot: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%"
  },
  textArea: {
    borderBottomColor: Colors.light.tropicalIndigo,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 2
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
export default function CreateScreen() {
  const user = useSelector((state: RootState) => state.user);

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
      handleClick: () => undefined
    },
    {
      name: "code-bracket"
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nova Postagem</Text>
        <Button style={styles.publishButton}>
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
      />
      <View style={styles.postContent}>
        <TextArea
          placeholder="O que você está desenvolvendo? Conte-nos mais!"
          style={styles.textArea}
        />
        <View style={styles.postContentActions}>
          {postContentActions.map((postContentAction) => (
            <Icon
              key={`post-content-action-${postContentAction.name}`}
              name={postContentAction.name}
              size={20}
              color="white"
              style={
                postContentAction.handleClick
                  ? {}
                  : styles.postContentActionDisabled
              }
            />
          ))}
        </View>
      </View>
      <View style={styles.tagsRoot}>
        <Tags label="Tags" placeholder="Adicione tags">
          <Tag name="Programming" />
        </Tags>
        <View style={styles.recommendedTagsRoot}>
          <Tag name="Programming" />
        </View>
      </View>
    </View>
  );
}
