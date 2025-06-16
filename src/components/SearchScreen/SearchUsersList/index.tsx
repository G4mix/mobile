import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import { UserState } from "@/features/auth/userSlice";
import { UserListItem } from "./components/UserListItem";

const styles = StyleSheet.create({
  listWrapper: {
    width: "100%"
  }
});

export function SearchUsersList({ users }: { users: UserState[] }) {
  return (
    <View style={styles.listWrapper}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          paddingInline: 18,
          marginBottom: 6
        }}
      >
        Usuários
      </Text>
      <View
        style={{
          marginBottom: 165
        }}
      >
        <FlatList
          data={users ?? []}
          keyExtractor={(user) => user.id}
          renderItem={({ item }) => <UserListItem userId={item.userProfile.id} />}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Colors.light.periwinkle
              }}
            />
          )}
        />
      </View>
    </View>
  );
}
