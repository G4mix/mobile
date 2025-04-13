import { Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { Icon } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { UserState } from "@/features/auth/userSlice";

export const styles = StyleSheet.create({
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

type PostHeaderProps = {
  author: {
    id: string;
    icon: string | null;
    displayName: string | null;
    user: {
      id: string;
      username: string;
      email: string;
      verified: boolean;
      created_at: string;
    };
  };
};

export function PostHeader({ author }: PostHeaderProps) {
  const userProfileId = useSelector(
    (state: { user: UserState }) => state.user.userProfile.id
  );
  return (
    <View style={styles.firstRow}>
      <View style={styles.leftSide}>
        <View style={styles.postUserInformation}>
          {author.icon ? (
            <Image source={{ uri: author.icon }} style={styles.imageProfile} />
          ) : (
            <Icon size={18} name="user-circle" color={Colors.dark.background} />
          )}
          <Text style={styles.userName}>{author.user.username}</Text>
        </View>
        <Text>•</Text>
        <Text>05 mar. 25</Text>
      </View>
      {userProfileId === author.id && (
        <Icon
          size={24}
          name="ellipsis-horizontal"
          color={Colors.dark.background}
        />
      )}
    </View>
  );
}
