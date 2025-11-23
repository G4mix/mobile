import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { styles as feedStyles } from "../feed";
import { FeedHeader } from "@/components/FeedHeader";
import { Colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  ...feedStyles,
  projects: {
    ...feedStyles.ideas,
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
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
        </View>
      </ScrollView>
    </View>
  );
}
