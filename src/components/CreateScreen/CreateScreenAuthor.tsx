import { Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Text, View } from "../Themed";
import { Icon } from "../Icon";
import { Colors } from "@/constants/colors";
import { styles as postHeaderStyles } from "@/components/Post/PostHeader";
import { RootState } from "@/constants/reduxStore";
import { getImgWithTimestamp } from "@/utils/getImgWithTimestamp";

const styles = StyleSheet.create({
  imageProfile: {
    ...postHeaderStyles.imageProfile,
    height: 24,
    width: 24
  },
  postUserIcon: {
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }] as any
  },
  postUserIconCircle: {
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: [{ translateX: -9 }, { translateY: -9 }] as any
  },
  postUserInformation: {
    ...postHeaderStyles.postUserInformation,
    justifyContent: "flex-start"
  },
  userName: {
    ...postHeaderStyles.userName,
    color: Colors.light.majorelleBlue,
    fontSize: 12,
    fontWeight: "bold"
  }
});

export function CreateScreenAuthor() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <View style={styles.postUserInformation}>
      {user.userProfile.icon ? (
        <Image
          source={{ uri: getImgWithTimestamp(user?.userProfile?.icon) }}
          style={styles.imageProfile}
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
                borderRadius: 9999
              }
            ]}
          />
          <View
            style={[
              styles.postUserIconCircle,
              {
                width: 18,
                height: 18,
                borderRadius: 9999,
                backgroundColor: Colors.light.majorelleBlue
              }
            ]}
          />
        </View>
      )}
      <Text style={styles.userName}>{user.username}</Text>
    </View>
  );
}
