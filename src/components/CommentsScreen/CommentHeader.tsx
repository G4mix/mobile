import { Image, StyleSheet, View } from "react-native";
import { Icon } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { formatDate } from "@/utils/formatDate";
import { IdeaType } from "../Idea";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";

export const styles = StyleSheet.create({
  firstRow: {
    color: Colors.dark.background,
    display: "flex",
    flexDirection: "row",
    gap: 4,
    justifyContent: "space-between",
  },
  imageProfile: {
    borderRadius: 9999,
    height: 18,
    width: 18,
  },
  leftSide: {
    alignItems: "center",
    display: "flex",
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
  userName: {
    fontSize: 13.33,
    fontWeight: "medium",
  },
});

type CommentHeaderProps = {
  author: IdeaType["author"];
  createdAt: string;
};

export function CommentHeader({ author, createdAt }: CommentHeaderProps) {
  return (
    <View style={styles.firstRow}>
      <View style={styles.leftSide}>
        <View style={styles.postUserInformation}>
          {author.icon ? (
            <Image
              source={{ uri: getImgWithTimestamp(author.icon) }}
              style={styles.imageProfile}
            />
          ) : (
            <Icon size={18} name="user-circle" color={Colors.dark.background} />
          )}
          <Text style={styles.userName}>{author.user.username}</Text>
        </View>
        <Text>•</Text>
        <Text>{formatDate(createdAt)}</Text>
      </View>
    </View>
  );
}
