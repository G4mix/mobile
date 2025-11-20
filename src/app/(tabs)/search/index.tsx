import { Keyboard, StyleSheet, View } from "react-native";
import { useRef, useState } from "react";
import { Colors } from "@/constants/colors";
import { useUsers } from "@/hooks/useUsers";
import { debounce } from "@/utils/debounce";
import { SearchHeader } from "@/components/SearchScreen/SearchHeader";
import { SearchUsersList } from "@/components/SearchScreen/SearchUsersList";

const styles = StyleSheet.create({
  searchContent: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    width: "100%",
  },
});

export default function SearchScreen() {
  const [searchValue, setSearchValue] = useState("");

  const { data } = useUsers({
    search: searchValue,
  });

  const users = data?.pages?.flatMap((page) => page?.data || []) || [];

  const debounceSearch = useRef(
    debounce((value: string) => {
      setSearchValue(value);
    }, 1000),
  ).current;

  const onChangeText = (value: string) => {
    debounceSearch(value);
  };

  const onSubmitEditing = () => {
    Keyboard.dismiss();
  };

  return (
    <View
      style={{
        backgroundColor: Colors.light.background,
        flex: 1,
        paddingBottom: 60,
      }}
    >
      <SearchHeader
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />

      <View style={styles.searchContent}>
        <SearchUsersList users={users} />
      </View>
    </View>
  );
}
