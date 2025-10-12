import { ScrollView, Image, Pressable } from "react-native";
import { MentionSuggestionsProps } from "react-native-controlled-mentions";
import { Portal } from "react-native-paper";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";
import { useUsers } from "@/hooks/useUsers";
import { InView } from "../InView";
import { Icon } from "../Icon";
import { styles } from "../Idea/IdeaHeader";
import { RenderUserSugestionsLoading } from "./RenderUserSugestionsLoading";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";

export function RenderUserSuggestions({
  keyword,
  onSuggestionPress
}: MentionSuggestionsProps) {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useUsers({
    search: keyword || ""
  });
  const users = data?.pages?.flatMap((page) => page?.data || []) || [];
  if (typeof keyword !== "string") return null;

  return (
    <Portal>
      <View
        style={{
          bottom: 58,
          position: "absolute",
          width: "100%",
          borderTopWidth: 1,
          borderColor: Colors.light.russianViolet
        }}
      >
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
          {users.map((user) => (
            <Pressable
              key={user.id}
              focusable={false}
              onPress={() =>
                onSuggestionPress({
                  id: user.id,
                  name: user.user.username
                })
              }
              style={{
                padding: 12,
                flexDirection: "row",
                gap: 4,
                borderBottomWidth: 1,
                borderColor: Colors.light.periwinkle
              }}
            >
              {user.icon ? (
                <Image
                  source={{ uri: getImgWithTimestamp(user.icon) }}
                  style={styles.imageProfile}
                />
              ) : (
                <Icon
                  size={18}
                  name="user-circle"
                  color={Colors.dark.background}
                />
              )}
              <View style={{ flexDirection: "column", gap: 4 }}>
                <Text style={{ fontWeight: "bold" }}>
                  {user.displayName || user.user.username}
                </Text>
                {user.displayName && <Text>{user.user.username}</Text>}
              </View>
            </Pressable>
          ))}
          {isFetchingNextPage ||
            (!data &&
              [0, 1, 2].map((value) => (
                <RenderUserSugestionsLoading
                  key={`user-suggestion-loading-${value}`}
                />
              )))}
          {isFetchingNextPage || !hasNextPage ? null : (
            <InView onInView={fetchNextPage} />
          )}
        </ScrollView>
      </View>
    </Portal>
  );
}
