import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { api } from "@/constants/api";
import { Colors } from "@/constants/colors";
import { UserState } from "@/features/auth/userSlice";
import { useToast } from "@/hooks/useToast";
import { debounce } from "@/utils/debounce";
import { formatFollowers } from "@/utils/formatFollowers";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";
import { handleRequest } from "@/utils/handleRequest";

const styles = StyleSheet.create({
  followers: {
    fontSize: 10,
    marginTop: 8
  },
  imageProfile: {
    borderRadius: 9999,
    height: 30,
    width: 30
  },
  leftSide: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 4
  },
  postUserInformation: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center"
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold"
  },
  usersListItem: {
    width: "100%"
  }
});

export function UserListItem({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const queryClient = useQueryClient();

  const { data, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: [userId],
    queryFn: async () => {
      const response = await api.get<UserState>(`/user/${userId}`);
      return response.data;
    },
    enabled: !!userId
  });

  useEffect(() => {
    if (isError) router.push("/feed");
  }, [isError]);

  useEffect(() => {
    if (isSuccess) setIsFollowing(data.userProfile.isFollowing ?? false);
  }, [isSuccess]);

  const executeFollow = async ({
    userProfileId
  }: {
    userProfileId: string;
  }) => {
    if (isLoadingFollow) return;

    setIsLoading(true);

    const res = await handleRequest({
      requestFn: () =>
        api.post(
          `/follow?followingUserId=${userProfileId}&wantFollow=${isFollowing}`
        ),
      showToast,
      setIsLoading
    });

    if (!res) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: [userId] });
    refetch();

    setIsLoading(false);
  };

  const debouncedHandleFollow = useRef(
    debounce(
      ({ userProfileId }: { userProfileId: string }) =>
        executeFollow({ userProfileId }),
      1000
    )
  ).current;

  const handleFollow = ({ userProfileId }: { userProfileId: string }) => {
    if (!isFollowing) {
      setIsFollowing((prevValue) => !prevValue);
      debouncedHandleFollow({ userProfileId });
    }
  };

  return (
    !isLoading &&
    data && (
      <View
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          paddingBlock: 10,
          paddingInline: 18
        }}
      >
        <View>
          <View style={styles.leftSide}>
            <TouchableOpacity
              style={styles.postUserInformation}
              onPress={() =>
                router.push(`/(tabs)/profile/${data.userProfile.id}`)
              }
            >
              {data.userProfile.icon ? (
                <Image
                  source={{
                    uri: getImgWithTimestamp(data.userProfile.icon)
                  }}
                  style={styles.imageProfile}
                />
              ) : (
                <Icon
                  size={30}
                  name="user-circle"
                  color={Colors.dark.background}
                />
              )}
              <Text style={styles.userName}>{data?.username}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.followers}>
            {formatFollowers(data?.userProfile.followersCount)} seguidores
          </Text>
        </View>

        <Button
          style={{
            minWidth: "auto",
            paddingHorizontal: 14,
            paddingVertical: 8
          }}
          onPress={() =>
            handleFollow({
              userProfileId: data.userProfile.id
            })
          }
        >
          <Text style={{ color: Colors.light.white }}>
            {isFollowing ? "Seguindo" : "Seguir"}
          </Text>
        </Button>
      </View>
    )
  );
}
