import { ScrollView, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Text, View } from "@/components/Themed";
import { styles as feedStyles } from "../../feed";
import { Colors } from "@/constants/colors";
import { Header } from "@/components/Header";

export const styles = StyleSheet.create({
  ...feedStyles,
  projects: {
    ...feedStyles.ideas,
    backgroundColor: "transparent",
    gap: 12,
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
  const route = useRoute();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header
        title="Voltar"
        route={route}
        navigation={navigation as any}
        options={{}}
      />
      <ScrollView style={styles.scroll}>
        <View style={styles.projects}>
          <Text style={styles.title}>Projetos com detalhes</Text>
        </View>
      </ScrollView>
    </View>
  );
}
