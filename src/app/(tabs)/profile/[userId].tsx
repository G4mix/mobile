import { useSelector } from "react-redux";
import { View } from "@/components/Themed";
import { ContentTabs, Tab } from "@/components/ContentTabs";
import { ProfileAbout } from "@/components/ProfileScreen/ProfileAbout";
import { ProfilePosts } from "@/components/ProfileScreen/ProfilePosts";
import { Colors } from "@/constants/colors";
import { ProfileHeader } from "@/components/ProfileScreen/ProfileHeader";

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 20,
//     fontWeight: "bold"
//   }
// });

export default function ProfileScreen() {
  const actualTab = useSelector(
    (state: any) => state.profile.actualTab
  ) as Tab<"profile">["key"];

  const tabs: Tab<"profile">[] = [
    {
      name: "Postagens",
      key: "posts"
    },
    {
      name: "Sobre",
      key: "about"
    }
  ];

  const tabComponents = {
    posts: ProfilePosts,
    about: ProfileAbout
  };

  const ActualTab = tabComponents[actualTab];

  return (
    <View style={{ backgroundColor: Colors.light.background, flex: 1 }}>
      <ProfileHeader />
      <ContentTabs tabs={tabs} tabType="profile" />
      <ActualTab />
      {/* <Button
          onPress={() => {
            logout();
            removeItem("user");
            removeItem("accessToken");
            removeItem("refreshToken");
            router.replace("/auth/signin");
          }}
        >
          <Text>Logout</Text>
        </Button> */}
    </View>
  );
}
