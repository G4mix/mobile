import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { View } from "@/components/Themed";
import { ContentTabs } from "@/components/ContentTabs";
import { Post } from "@/components/Post";
import { RootState } from "@/constants/reduxStore";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1
  },
  posts: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    width: "100%"
  }
});

export default function FeedScreen() {
  const user = useSelector((state: RootState) => state.user);

  const posts = [
    { title: "Teste", content: "Aoba" },
    {
      title: "Shut a lonely day",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it..."
    },
    { title: "Outro post", content: "Conteúdo aleatório" }
  ];

  return (
    <View style={styles.container}>
      <ContentTabs />
      <View style={styles.posts}>
        {posts.map((post) => (
          <Post
            key={post.content}
            title={post.title}
            content={post.content}
            user={user}
          />
        ))}
      </View>
    </View>
  );
}
