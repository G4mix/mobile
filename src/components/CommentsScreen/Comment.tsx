import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/colors";
import { CommentActions } from "./CommentActions";
import { CommentHeader } from "./CommentHeader";
import { CommentBody } from "./CommentBody";
import { PostType } from "../Post";
import { View } from "../Themed";

export type CommentType = {
  id: string;
  content: string;
  likesCount: number;
  created_at: string;
  parentCommentId?: string;
  postId: string;
  author: PostType["author"];
  replies: Omit<CommentType[], "replies">;
};

type CommentProps = {
  comment?: CommentType;
  replying: {
    parentComment: string;
    toMark: string;
    author?: CommentType["author"];
  };
  commentReply: () => void;
  commentType: "post" | "comment" | "reply";
};

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: Colors.light.white,
    borderBottomWidth: 1,
    borderColor: Colors.light.periwinkle,
    display: "flex",
    gap: 8,
    padding: 16,
    position: "relative",
    width: "100%"
  },
  leftBar: {
    backgroundColor: "#6B3FA0",
    height: "136%",
    left: 0,
    position: "absolute",
    top: 0,
    width: 5
  }
});

export function Comment({
  comment,
  replying,
  commentReply,
  commentType
}: CommentProps) {
  const { commentId } = useLocalSearchParams<{ commentId: string }>();

  if (!comment) return null;

  return (
    <TouchableOpacity
      style={[
        styles.commentContainer,
        {
          paddingLeft:
            commentType === "post" ? 16 : commentType === "comment" ? 32 : 48
        }
      ]}
      onPress={() => {
        if (commentId || commentType === "reply") {
          commentReply();
        } else {
          router.push(`/posts/${comment.postId}/comments/${comment.id}`);
        }
      }}
    >
      {replying.toMark === comment.id && <View style={styles.leftBar} />}
      <CommentHeader author={comment.author} createdAt={comment.created_at} />
      <CommentBody content={comment.content} />
      <CommentActions
        commentId={comment.id}
        likesCount={comment.likesCount}
        commentReply={commentReply}
      />
    </TouchableOpacity>
  );
}
