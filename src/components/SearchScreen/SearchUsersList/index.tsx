import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import { UserState } from "@/features/auth/userSlice";
import { UserListItem } from "./components/UserListItem";

const styles = StyleSheet.create({
  listWrapper: {
    width: "100%"
  }
});

function ItemSeparator() {
  return (
    <View
      style={{
        width: "100%",
        height: 1,
        backgroundColor: Colors.light.periwinkle
      }}
    />
  );
}

const renderUserItem = ({ item }: { item: UserState }) => (
  <UserListItem userId={item.id} />
);

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
          renderItem={renderUserItem}
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>
    </View>
  );
}
