import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { styles as feedStyles } from "../feed";
import { FeedHeader } from "@/components/FeedHeader";
import { Colors } from "@/constants/colors";
import { ProjectItem } from "@/components/ProjectsScreen/ProjectItem";

export const styles = StyleSheet.create({
  ...feedStyles,
  projects: {
    ...feedStyles.ideas,
    backgroundColor: "transparent",
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scroll: {
    ...feedStyles.scroll,
    backgroundColor: "#F5F5F5",
  },
  title: {
    color: Colors.light.russianViolet,
    fontSize: 19.2,
    fontWeight: 700,
  },
});

export default function ProjectsScreen() {
  return (
    <View style={styles.container}>
      <FeedHeader />
      <ScrollView style={styles.scroll}>
        <View style={styles.projects}>
          <Text style={styles.title}>Projetos</Text>
          <ProjectItem
            id="1"
            title="Lorem Ipsum Project"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            icon="https://via.placeholder.com/150"
            backgroundImage="https://via.placeholder.com/150"
            followersCount={10}
            ideasCount={10}
            topFollowers={[
              { name: "Follower 1", icon: "https://via.placeholder.com/150" },
              { name: "Follower 2", icon: "https://via.placeholder.com/150" },
              { name: "Follower 3", icon: "https://via.placeholder.com/150" },
            ]}
          />
        </View>
      </ScrollView>
    </View>
  );
}
