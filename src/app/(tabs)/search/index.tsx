import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/Themed";
import { Colors } from "@/constants/colors";
import { Icon } from "@/components/Icon";
import { useEffect, useRef, useState } from "react";
import { formatFollowers } from "@/utils/formatFollowers";
import { Button } from "@/components/Button";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useUsers } from "@/hooks/useUsers";
import { handleRequest } from "@/utils/handleRequest";
import { api } from "@/constants/api";
import { useToast } from "@/hooks/useToast";
import { debounce } from "@/utils/debounce";

const styles = StyleSheet.create({
  header: {
    width: "100%",
    padding: 16,
    position: "fixed",
    top: 0,
    left: 0,
  },
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: Colors.light.tropicalIndigo,
    paddingBlock: 8,
    paddingInline: 16,
  },
  input: {
    backgroundColor: "transparent",
    display: "flex",
    flexGrow: 1,
    minHeight: 0,
    padding: 0,
    fontSize: 14,
  },
  searchContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  listWrapper: {
    width: "100%",
  },
  usersListItem: {
    width: "100%",
  },
  leftSide: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  postUserInformation: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  imageProfile: {
    borderRadius: 9999,
    height: 30,
    width: 30,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  followers: {
    fontSize: 10,
    marginTop: 8,
  },
});

export default function SearchScreen() {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useUsers({
    search: searchValue,
  });

  const users = data?.pages?.flatMap((page) => page?.data || []) || [];

  const debounceSearch = useRef(
    debounce((value: string) => {
      setSearchValue(value);
    }, 1000)
  ).current;

  const onChangeText = (value: string) => {
    debounceSearch(value);
  };

  const onSubmitEditing = () => {
    Keyboard.dismiss();
  };

  const executeFollow = async ({
    user_profile_id,
    is_following,
  }: {
    user_profile_id: string;
    is_following: boolean;
  }) => {
    if (isLoading) return;

    const data = await handleRequest({
      requestFn: () =>
        api.post(
          `/follow?followingUserId=${user_profile_id}&wantFollow=${is_following}`
        ),
      showToast,
      setIsLoading,
    });

    if (!data) {
      return;
    }

    console.log(data);
    queryClient.setQueryData(["users", user_profile_id], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        userProfile: {
          ...oldData.userProfile,
          isFollowing: !oldData.userProfile.isFollowing,
        },
      };
    });
  };

  const debouncedHandleFollow = useRef(
    debounce(
      ({
        user_profile_id,
        is_following,
      }: {
        user_profile_id: string;
        is_following: boolean;
      }) => executeFollow({ user_profile_id, is_following }),
      1000
    )
  );

  const handleFollow = ({
    user_profile_id,
    is_following,
  }: {
    user_profile_id: string;
    is_following: boolean;
  }) => {
    debouncedHandleFollow.current({ user_profile_id, is_following });
  };

  return (
    <View
      style={{
        backgroundColor: Colors.light.background,
        flex: 1,
        paddingBottom: 60,
      }}
    >
      <View style={styles.header}>
        <View style={styles.container}>
          <Icon
            size={16}
            name="magnifying-glass"
            color={Colors.light.majorelleBlue}
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 4,
            }}
          />
          <TextInput
            placeholder={"O que está buscando?"}
            style={styles.input}
            placeholderTextColor={Colors.light.tropicalIndigo}
            onChangeText={onChangeText}
            returnKeyType="default"
            onSubmitEditing={onSubmitEditing}
          />
        </View>
      </View>

      <View style={styles.searchContent}>
        <View style={styles.listWrapper}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              paddingInline: 18,
              marginBottom: 6,
            }}
          >
            Usuários
          </Text>
          <View
            style={{
              marginBottom: 165,
            }}
          >
            <FlatList
              data={users ?? []}
              keyExtractor={(user) => user.id}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                    paddingBlock: 10,
                    paddingInline: 18,
                  }}
                >
                  <View>
                    <View style={styles.leftSide}>
                      <TouchableOpacity
                        style={styles.postUserInformation}
                        onPress={() =>
                          router.push(`/(tabs)/profile/${item.userProfile.id}`)
                        }
                      >
                        {item.userProfile.icon ? (
                          <Image
                            source={{
                              uri: getImgWithTimestamp(item.userProfile.icon),
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
                        <Text style={styles.userName}>{item.username}</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.followers}>
                      {formatFollowers(item.userProfile.followersCount)}{" "}
                      seguidores
                    </Text>
                  </View>

                  <Button
                    style={{
                      minWidth: "auto",
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                    }}
                    onPress={() =>
                      handleFollow({
                        user_profile_id: item.userProfile.id,
                        is_following: item.userProfile.isFollowing ?? false,
                      })
                    }
                  >
                    <Text style={{ color: Colors.light.white }}>
                      {item.userProfile.isFollowing ? "Seguindo" : "Seguir"}
                    </Text>
                  </Button>
                </View>
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: Colors.light.periwinkle,
                  }}
                />
              )}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
