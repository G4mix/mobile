import { ScrollView } from "react-native";
import { View } from "../Themed";
import { ProfileAboutCard } from "./ProfileAboutCard";

export function ProfileAbout() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <ProfileAboutCard />
    </ScrollView>
  );
}
