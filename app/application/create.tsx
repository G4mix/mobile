import { StyleSheet, Image } from "react-native";
import { Text, View } from "@/components/Themed";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { styles as postHeaderStyles } from "@/components/Post/PostHeader";
import { useSelector } from "react-redux";
import { RootState } from "@/constants/reduxStore";
import { Colors } from "@/constants/colors";
import { Input } from "@/components/Input";


const styles = StyleSheet.create({
  postUserInformation: {
    ...postHeaderStyles.postUserInformation,
    justifyContent: "flex-start"
  },
  imageProfile: {
    ...postHeaderStyles.imageProfile,
    width: 24,
    height: 24
  },
  userName: {
    ...postHeaderStyles.userName,
    color: Colors.light.majorelleBlue,
    fontWeight: "bold",
    fontSize: 20
  },
  container: {
    flex: 1,
    gap: 18,
    padding: 20
  },
  header: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  publishButton: {
    minWidth: 0
  }
});


export default function CreateScreen() {
  const user = useSelector((state: RootState) => state.user);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nova Postagem</Text>
        <Button style={styles.publishButton}><Text>Publicar</Text></Button>
      </View>
    <View style={styles.postUserInformation}>
      {user.userProfile.icon ? (
          <Image
              source={{ uri: user?.userProfile?.icon }}
              style={styles.imageProfile}
          />
          ) : (
            <Icon size={24} name="user-circle" color={Colors.light.majorelleBlue} />
          )}
          <Text style={styles.userName}>{user.username}</Text>
      </View>
      <Input placeholder="Qual é o título da sua ideia?" color={Colors.light.tropicalIndigo} />
    </View>
  );
}
