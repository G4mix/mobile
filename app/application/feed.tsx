import { StyleSheet } from "react-native";

import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Text, View } from "@components/Themed";
import { RootState } from "@constants/reduxStore";
import { Button } from "@components/Button";
import { logout } from "@features/auth/userSlice";
import { removeItem } from "@constants/storage";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default function FeedScreen() {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <Text>Nome do usuário: {user.username}</Text>
      <Button
        onPress={() => {
          logout();
          removeItem("user");
          removeItem("accessToken");
          removeItem("refreshToken");
          router.replace("/");
        }}
      >
        <Text>Logout</Text>
      </Button>
    </View>
  );
}
