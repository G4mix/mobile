import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { CommentActions } from "./CommentActions";
import { CommentHeader } from "./CommentHeader";
import { CommentBody } from "./CommentBody";
import { PostType } from "../Post";

export type CommentType = {
  id: string;
  content: string;
  likesCount: number;
  created_at: string;
  parentCommentId?: string;
  postId: string;
  author: PostType["author"];
};

type CommentProps = {
  comment?: CommentType;
};

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: Colors.light.white,
    borderBottomWidth: 1,
    borderColor: Colors.light.periwinkle,
    display: "flex",
    gap: 8,
    padding: 16,
    width: "100%"
  }
});

export function Comment({ comment }: CommentProps) {
  if (!comment) return null;
  const commentReply = async () => {
    router.push(`/posts/${comment.postId}/comments/${comment.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.commentContainer, { paddingLeft: 32 }]}
      onPress={commentReply}
    >
      <CommentHeader author={comment.author} createdAt={comment.created_at} />
      <CommentBody content={comment.content} />
      <CommentActions
        commentId={comment.id}
        likesCount={comment.likesCount}
        postId={comment.postId}
      />
    </TouchableOpacity>
  );
}
