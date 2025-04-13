import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { PostHeader } from "./PostHeader";
import { PostBody } from "./PostBody";
import { PostActions } from "./PostActions";

export type PostType = {
  id: string;
  title: string;
  content: string;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
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
  images: {
    id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    postId: string;
  }[];
  links: {
    id: string;
    postId: string;
    url: string;
  }[];
  tags: { id: string; name: string; postId: string }[];
};

type PostProps = {
  post?: PostType;
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

export function Post({ post }: PostProps) {
  if (!post) return null;
  return (
    <View style={styles.postContainer}>
      <PostHeader author={post.author} />
      <PostBody title={post.title} content={post.content} />
      <PostActions postId={post.id} likesCount={post.likesCount} commentsCount={post.commentsCount} viewsCount={post.viewsCount} />
    </View>
  );
}
