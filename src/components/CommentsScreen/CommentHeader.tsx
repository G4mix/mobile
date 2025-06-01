import { Image, View } from "react-native";
import { Icon } from "../Icon";
import { Text } from "../Themed";
import { Colors } from "@/constants/colors";
import { formatDate } from "@/utils/formatDate";
import { PostType } from "../Post";
import { styles } from "../Post/PostHeader";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";

type CommentHeaderProps = {
  author: PostType["author"];
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
