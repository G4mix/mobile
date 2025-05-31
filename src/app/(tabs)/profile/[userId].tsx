import { useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { View } from "@/components/Themed";
import { ContentTabs, Tab } from "@/components/ContentTabs";
import { ProfileAbout } from "@/components/ProfileScreen/ProfileAbout";
import { ProfilePosts } from "@/components/ProfileScreen/ProfilePosts";
import { Colors } from "@/constants/colors";
import { ProfileHeader } from "@/components/ProfileScreen/ProfileHeader";
import { api } from "@/constants/api";
import { UserState } from "@/features/auth/userSlice";

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await api.get<UserState>(`/user/${userId}`);
      return response.data;
    },
    enabled: !!userId
  });

  if (isError) router.push("/feed");

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
      {!isLoading && data && (
        <ProfileHeader
          icon={data.userProfile.icon}
          displayName={data.userProfile.displayName}
          backgroundImage={data.userProfile.backgroundImage}
          username={data.username}
          id={data.id}
          onlyView
        />
      )}
      <ContentTabs tabs={tabs} tabType="profile" />
      <ActualTab />
    </View>
  );
}
