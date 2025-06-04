import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { View, PanResponder } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ContentTabs, Tab } from "@/components/ContentTabs";
import { ProfileAbout } from "@/components/ProfileScreen/ProfileAbout";
import { ProfilePosts } from "@/components/ProfileScreen/ProfilePosts";
import { Colors } from "@/constants/colors";
import { ProfileHeader } from "@/components/ProfileScreen/ProfileHeader";
import { api } from "@/constants/api";
import { UserState } from "@/features/auth/userSlice";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";
import { setActualTab } from "@/features/profile/profileSlice"; // <- sua action de redux

export default function ProfileScreen() {
  const dispatch = useDispatch();
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
    { name: "Postagens", key: "posts" },
    { name: "Sobre", key: "about" }
  ];

  const tabComponents = {
    posts: ProfilePosts,
    about: ProfileAbout
  };

  const tabKeys = tabs.map((tab) => tab.key);

  const actualTabRef = useRef(actualTab);
  useEffect(() => {
    actualTabRef.current = actualTab;
  }, [actualTab]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20,
      onPanResponderRelease: (_, gestureState) => {
        const currentIndex = tabKeys.indexOf(actualTabRef.current);
        if (gestureState.dx < -50 && currentIndex < tabKeys.length - 1) {
          dispatch(setActualTab(tabKeys[currentIndex + 1]));
        } else if (gestureState.dx > 50 && currentIndex > 0) {
          dispatch(setActualTab(tabKeys[currentIndex - 1]));
        }
      }
    })
  ).current;
  const ActualTab = tabComponents[actualTab];

  return (
    <View
      style={{ backgroundColor: Colors.light.background, flex: 1 }}
      {...panResponder.panHandlers}
    >
      {!isLoading && data && (
        <ProfileHeader
          icon={getImgWithTimestamp(data.userProfile.icon!)}
          displayName={data.userProfile.displayName}
          backgroundImage={getImgWithTimestamp(
            data.userProfile.backgroundImage!
          )}
          username={data.username}
          id={data.id}
          followersCount={data.userProfile.followersCount}
          followingCount={data.userProfile.followingCount}
          onlyView
        />
      )}
      <ContentTabs tabs={tabs} tabType="profile" />
      <ActualTab userId={userId} user={data} />
    </View>
  );
}
