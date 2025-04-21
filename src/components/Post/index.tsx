import React, { RefObject } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/constants/colors";
import { PostHeader } from "./PostHeader";
import { PostBody } from "./PostBody";
import { PostActions } from "./PostActions";
import { PostLink } from "./PostLink";
import { InView } from "../InView";

export type PostType = {
  id: string;
  title: string;
  content: string;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  created_at: string;
  updated_at?: string;
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
  alreadyVisualized?: boolean;
  post?: PostType;
  onInView?: () => void;
  scrollRef?: RefObject<ScrollView>;
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

export function Post({
  alreadyVisualized,
  post,
  onInView,
  scrollRef
}: PostProps) {
  if (!post) return null;
  return (
    <View style={styles.postContainer}>
      <PostHeader
        postId={post.id}
        author={post.author}
        createdAt={post.created_at}
        updatedAt={post.updated_at}
      />
      <PostBody
        title={post.title}
        content={post.content}
        images={post.images}
        postId={post.id}
      />
      {post.links.map((link) => (
        <PostLink key={`link-${link.postId}-${link.id}`} url={link.url} />
      ))}
      <PostActions
        postId={post.id}
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        viewsCount={post.viewsCount}
      />
      {!alreadyVisualized && scrollRef && onInView && (
        <InView scrollRef={scrollRef} onInView={onInView} />
      )}
    </View>
  );
}
