import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { Text, View } from "../Themed";
import { Icon } from "../Icon";
import { Colors } from "@/constants/colors";
import { styles as postHeaderStyles } from "@/components/CommentsScreen/CommentHeader";
import { RootState } from "@/constants/reduxStore";
import { getCachedImageUrl } from "@/utils/getCachedImageUrl";

const styles = StyleSheet.create({
  imageProfile: {
    ...postHeaderStyles.imageProfile,
    height: 24,
    width: 24,
  },
  postUserIcon: {
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }] as any,
  },
  postUserIconCircle: {
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: [{ translateX: -9 }, { translateY: -9 }] as any,
  },
  postUserInformation: {
    ...postHeaderStyles.postUserInformation,
    justifyContent: "flex-start",
  },
  userName: {
    ...postHeaderStyles.userName,
    color: Colors.light.majorelleBlue,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export function CreateScreenAuthor() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <View style={styles.postUserInformation}>
      {user.icon ? (
        <Image
          source={{ uri: getCachedImageUrl(user?.icon) }}
          style={styles.imageProfile}
          cachePolicy="memory-disk"
          contentFit="cover"
        />
      ) : (
        <View style={{ position: "relative", width: 24, height: 24 }}>
          <Icon
            size={24}
            name="user-circle"
            color={Colors.light.periwinkle}
            style={[
              styles.postUserIcon,
              {
                zIndex: 1,
                borderRadius: 9999,
              },
            ]}
          />
          <View
            style={[
              styles.postUserIconCircle,
              {
                width: 18,
                height: 18,
                borderRadius: 9999,
                backgroundColor: Colors.light.majorelleBlue,
              },
            ]}
          />
        </View>
      )}
      <Text style={styles.userName}>{user.user.username}</Text>
    </View>
  );
}
