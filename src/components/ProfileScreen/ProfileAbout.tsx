import { ScrollView } from "react-native";
import { ProfileAboutCard } from "./ProfileAboutCard";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { IdeaLink } from "../Idea/IdeaLink";
import { UserState } from "@/features/auth/userSlice";

export function ProfileAbout({ user }: { user?: UserState }) {
  if (!user) return null;
  return (
    <ScrollView style={{ flex: 1, marginBottom: 60 }}>
      <ProfileAboutCard title="Biografia">
        <Text
          style={{
            color: Colors.light.russianViolet,
            fontSize: 16,
          }}
        >
          {user.autobiography || "Ainda não tem uma bio..."}
        </Text>
      </ProfileAboutCard>
      {user.links.length !== 0 && (
        <ProfileAboutCard title="Links">
          {user.links.map((link) => (
            <IdeaLink url={link} key={`user-link-${link}`} />
          ))}
        </ProfileAboutCard>
      )}
    </ScrollView>
  );
}
