import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { ProfileAboutCard } from "./ProfileAboutCard";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { PostLink } from "../Post/PostLink";
import { RootState } from "@/constants/reduxStore";
import { useToast } from "@/hooks/useToast";
import { UserState } from "@/features/auth/userSlice";

export function ProfileAbout() {
  const user = useSelector((state: RootState) => state.user);
  const { showToast } = useToast();
  const handleLoadLinkError = (
    link: UserState["userProfile"]["links"][number]
  ) => {
    user.userProfile.links.filter((l) => l.url !== link.url);
    showToast({
      message:
        "Houve um erro ao tentar encontrar informações sobre o link fornecido!",
      color: "error"
    });
  };
  return (
    <ScrollView style={{ flex: 1 }}>
      <ProfileAboutCard title="Biografia">
        <Text
          style={{
            color: Colors.light.russianViolet,
            fontSize: 16
          }}
        >
          {user.userProfile.autobiography || "Ainda não tem uma bio..."}
        </Text>
      </ProfileAboutCard>
      {user.userProfile.links.length !== 0 && (
        <ProfileAboutCard title="Links">
          {user.userProfile.links.map((link) => (
            <PostLink
              url={link.url}
              noHorizontalPadding
              key={`user-link-${link}`}
              handleError={() => handleLoadLinkError(link)}
            />
          ))}
        </ProfileAboutCard>
      )}
    </ScrollView>
  );
}
