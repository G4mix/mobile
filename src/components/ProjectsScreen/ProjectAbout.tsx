import { ScrollView } from "react-native";
import { ProfileAboutCard } from "../ProfileScreen/ProfileAboutCard";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";

export function ProjectAbout({ description }: { description?: string }) {
  return (
    <ScrollView style={{ flex: 1, marginBottom: 60 }}>
      <ProfileAboutCard title="Descrição">
        <Text
          style={{
            color: Colors.light.russianViolet,
            fontSize: 16,
          }}
        >
          {description || "Ainda não tem uma descrição..."}
        </Text>
      </ProfileAboutCard>
    </ScrollView>
  );
}
