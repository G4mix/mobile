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
import { useState } from "react";
import { formatFollowers } from "@/utils/formatFollowers";
import { Button } from "@/components/Button";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";
import { router } from "expo-router";

const users = [
  {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: "Vinicius",
    followers: 10000,
  },
  {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: "Ana",
    followers: 8500,
  },
  {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: "Carlos",
    followers: 12000,
  },
  {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: "Mariana",
    followers: 5300,
  },
  {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: "Lucas",
    followers: 7800,
  },
  {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: "Fernanda",
    followers: 1000,
  },
  {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: "João",
    followers: 6700,
  },
  {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: "Patrícia",
    followers: 11000,
  },
  {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: "Rafael",
    followers: 4900,
  },
  {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: "Isabela",
    followers: 10200,
  },
  {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: "Thiago",
    followers: 8800,
  },
];

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
    marginTop: 8
  },
});

export default function SearchScreen() {
  const [searchValue, setSearchValue] = useState("");

  const onChangeText = (value: string) => {
    setSearchValue(value);
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
              data={users}
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
                          router.push(`/(tabs)/profile/${"author.id"}`)
                        }
                      >
                        {false ? (
                          <Image
                            source={{ uri: getImgWithTimestamp("author.icon") }}
                            style={styles.imageProfile}
                          />
                        ) : (
                          <Icon
                            size={30}
                            name="user-circle"
                            color={Colors.dark.background}
                          />
                        )}
                        <Text style={styles.userName}>{item.name}</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.followers}>
                      {formatFollowers(item.followers)} seguidores
                    </Text>
                  </View>

                  <Button
                    style={{
                      minWidth: "auto",
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                    }}
                    // onPress={handleFollow}
                  >
                    <Text style={{ color: Colors.light.white }}>
                      {false ? "Seguindo" : "Seguir"}
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
