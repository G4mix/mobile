import { Image, StyleSheet, View } from "react-native";
import { Icon } from "../Icon";
import { Text } from "../Themed";
import { UserState } from "@/features/auth/userSlice";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
  firstRow: {
    color: Colors.dark.background,
    display: "flex",
    flexDirection: "row",
    gap: 4,
    justifyContent: "space-between"
  },
  imageProfile: {
    borderRadius: 9999,
    height: 18,
    width: 18
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
    fontSize: 13.33,
    fontWeight: "medium"
  }
});

type PostHeaderProps = { user: UserState };

export function PostHeader({ user }: PostHeaderProps) {
  return (
    <View style={styles.firstRow}>
      <View style={styles.leftSide}>
        <View style={styles.postUserInformation}>
          {user.userProfile.icon ? (
            <Image
              source={{ uri: user?.userProfile?.icon }}
              style={styles.imageProfile}
            />
          ) : (
            <Icon size={18} name="user-circle" color={Colors.dark.background} />
          )}
          <Text style={styles.userName}>{user.username}</Text>
        </View>
        <Text>•</Text>
        <Text>05 mar. 25</Text>
      </View>
      <Icon
        size={24}
        name="ellipsis-horizontal"
        color={Colors.dark.background}
      />
    </View>
  );
}
