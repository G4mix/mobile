import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "@/constants/colors";
import { UserState } from "@/features/auth/userSlice";

type PostProps = {
  user: UserState;
  title?: string;
  content?: string;
  postImage?: string;
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold"
  },
  imageProfile: {
    borderRadius: 10
  },
  postContainer: {
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.periwinkle,
    borderRadius: 8,
    elevation: 3,
    margin: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  postDescription: {
    color: "#555",
    fontSize: 14,
    marginVertical: 8
  },
  postImage: {
    borderRadius: 8,
    height: 200,
    width: "100%"
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8
  }
});

export function Post({ user, title, content, postImage }: PostProps) {
  return (
    <View style={styles.postContainer}>
      <Image
        source={{
          uri:
            user.userProfile.icon ||
            "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
        }}
        style={styles.imageProfile}
      />
      <Text style={styles.postTitle}>{title}</Text>

      <Text style={styles.postDescription}>{content}</Text>

      <Image
        source={{ uri: postImage || "https://via.placeholder.com/300" }}
        style={styles.postImage}
      />

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Curtir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Comentar</Text>
        </TouchableOpacity>
        <FontAwesome size={24} name="bar-chart" />
      </View>
    </View>
  );
}
