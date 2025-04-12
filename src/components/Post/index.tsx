import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { PostHeader } from "./PostHeader";
import { PostBody } from "./PostBody";
import { PostActions } from "./PostActions";
import { PostLink } from "./PostLink";

export type PostType = {
  id: number;
  title: string;
  content: string;
  likesCount: number;
  viewsCount: number;
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
      {
        post.links.map((link) => <PostLink key={`link-${link.postId}-${link.id}`} url={link.url} />)
      }
      <PostActions postId={post.id} />
    </View>
  );
}
