import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/Themed";
import { removeItem } from "@/constants/storage";
import { Button } from "@/components/Button";
import { logout } from "@/features/auth/userSlice";

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <Text style={styles.title}>
      <Button
        onPress={() => {
          logout();
          removeItem("user");
          removeItem("accessToken");
          removeItem("refreshToken");
          router.replace("/auth/signin");
        }}
      >
        <Text>Logout</Text>
      </Button>
    </Text>
  );
}
