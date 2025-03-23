import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "@/constants/colors";
import { UserState } from "@/features/auth/userSlice";

const { width } = Dimensions.get("window");

type PostProps = {
  user: UserState;
  title?: string;
  content?: string;
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  actionOption: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 3
  },
  firstRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  imageProfile: {
    borderRadius: 10,
    height: 18,
    width: 18
  },
  postContainer: {
    backgroundColor: Colors.light.white,
    borderBottomWidth: 2,
    borderColor: Colors.light.periwinkle,
    padding: 16,
    width
  },
  postDescription: {
    color: "#555",
    fontSize: 14,
    marginVertical: 8
  },
  postTitle: {
    fontSize: 13.33,
    fontWeight: "bold"
  },
  postUserInformation: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center"
  },
  userName: {
    fontSize: 13.33
  }
});

export function Post({ user, title, content }: PostProps) {
  return (
    <View style={styles.postContainer}>
      <View style={styles.firstRow}>
        <View style={styles.postUserInformation}>
          <Image
            source={{
              uri:
                user?.userProfile?.icon ||
                "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
            }}
            style={styles.imageProfile}
          />
          <Text style={styles.userName}>{user.username} • 12/02/2025</Text>
        </View>
        <FontAwesome size={16} name="ellipsis-h" />
      </View>
      <Text style={styles.postTitle}>{title}</Text>
      <Text style={styles.postDescription}>{content}</Text>

      <View style={styles.actionContainer}>
        <View style={styles.actionOption}>
          <TouchableOpacity>
            <FontAwesome size={18} name="thumbs-o-up" />
          </TouchableOpacity>
          <Text>12k</Text>
        </View>
        <View style={styles.actionOption}>
          <TouchableOpacity>
            <FontAwesome size={18} name="commenting-o" />
          </TouchableOpacity>
          <Text>12k</Text>
        </View>
        <View style={styles.actionOption}>
          <FontAwesome size={18} name="bar-chart" />
          <Text>12k</Text>
        </View>
        <FontAwesome size={18} name="share-alt" />
      </View>
    </View>
  );
}
