import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { View, PanResponder, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContentTabs, Tab } from "@/components/ContentTabs";
import { ProfileAbout } from "@/components/ProfileScreen/ProfileAbout";
import { ProfileIdeas } from "@/components/ProfileScreen/ProfileIdeas";
import { Colors } from "@/constants/colors";
import { ProfileHeader } from "@/components/ProfileScreen/ProfileHeader";
import { api } from "@/constants/api";
import { UserState } from "@/features/auth/userSlice";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";
import { setActualTab } from "@/features/profile/profileSlice";
import { ProfileHeaderLoading } from "@/components/ProfileScreen/ProfileHeaderLoading";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const {
    data,
    isLoading,
    isError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await api.get<UserState>(`/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
  if (isError) router.push("/feed");

  const actualTab = useSelector(
    (state: any) => state.profile.actualTab,
  ) as Tab<"profile">["key"];
  const tabs: Tab<"profile">[] = [
    { name: "Ideias", key: "ideas" },
    { name: "Sobre", key: "about" },
  ];

  const tabComponents = {
    ideas: ProfileIdeas,
    about: ProfileAbout,
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
      },
    }),
  ).current;

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["user", userId] });
    await queryClient.invalidateQueries({
      queryKey: ["ideas", { authorId: userId }],
    });
    await refetchUser();
  };

  const { refreshControl } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  const ActualTab = tabComponents[actualTab];

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.light.background,
        flex: 1,
      }}
      refreshControl={refreshControl}
      {...panResponder.panHandlers}
    >
      <View
        style={{
          flex: 1,
          gap: 8,
        }}
      >
        {isLoading && !data && <ProfileHeaderLoading id={userId} />}
        {!isLoading && data && (
          <ProfileHeader
            isFollowing={data.isFollowing}
            icon={getImgWithTimestamp(data.icon!)}
            displayName={data.displayName}
            backgroundImage={getImgWithTimestamp(data.backgroundImage!)}
            username={data.user.username}
            id={data.id}
            userProfileId={data.id}
            followersCount={data.followers}
            followingCount={data.following}
            onlyView
          />
        )}
        <ContentTabs tabs={tabs} tabType="profile" />
        <ActualTab userId={userId} user={data} />
      </View>
    </ScrollView>
  );
}
