import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { View } from "@/components/Themed";
import { ContentTabs } from "@/components/ContentTabs";
import { Post } from "@/components/Post";
import { RootState } from "@/constants/reduxStore";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  posts: {
    display: "flex",
    flexDirection: "column"
  }
});

export default function FeedScreen() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <View style={styles.container}>
      <ContentTabs />
      <View style={styles.posts}>
        <Post title="Teste" content="Aoba" user={user}/>
        <Post title="Shut a lonely day" content="alfkjaslkfjalksdfjlkasdjflkjasd" user={user}/>

      </View>
    </View>
  );
}
