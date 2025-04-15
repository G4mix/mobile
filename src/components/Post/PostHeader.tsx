import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Icon } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { UserState } from "@/features/auth/userSlice";
import { formatDate } from "@/utils/formatDate";
import { PostType } from ".";

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
  author: PostType["author"];
  createdAt: string;
  updatedAt?: string;
  showOptions: () => void;
};

export function PostHeader({
  author,
  createdAt,
  updatedAt,
  showOptions
}: PostHeaderProps) {
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
        <Text>{formatDate(createdAt, updatedAt)}</Text>
      </View>
      {userProfileId === author.id && (
        <TouchableOpacity onPress={showOptions}>
          <Icon
            size={24}
            name="ellipsis-horizontal"
            color={Colors.dark.background}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
