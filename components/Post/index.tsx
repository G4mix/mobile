import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { UserState } from "@/features/auth/userSlice";
import { PostHeader } from "./PostHeader";
import { PostBody } from "./PostBody";
import { PostActions } from "./PostActions";

type PostProps = {
  user: UserState;
  title?: string;
  content?: string;
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: Colors.light.white,
    borderBottomWidth: 1,
    borderColor: Colors.light.periwinkle,
    display: "flex",
    gap: 8,
    padding: 16,
    width: "100%"
  }
});

export function Post({ user, title, content }: PostProps) {
  return (
    <View style={styles.postContainer}>
      <PostHeader user={user} />
      <PostBody title={title} content={content} />
      <PostActions />
    </View>
  );
}
