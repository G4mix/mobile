import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/colors";
import { CommentActions } from "./CommentActions";
import { CommentHeader } from "./CommentHeader";
import { CommentBody } from "./CommentBody";
import { IdeaType } from "../Idea";
import { View } from "../Themed";
import { CommentReplies } from "./CommentReplies";

export type CommentType = {
  id: string;
  content: string;
  likes: number;
  isLiked: boolean;
  replies: number;
  createdAt: string;
  updatedAt: string;
  parentCommentId?: string;
  ideaId: string;
  author: IdeaType["author"];
};

type CommentProps = {
  comment?: CommentType;
  replying: {
    parentComment: string;
    toMark: string;
    author?: CommentType["author"];
  };
  commentReply: () => void;
  commentType: "post" | "comment";
};

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: Colors.light.white,
    display: "flex",
    gap: 4,
    position: "relative",
    width: "100%",
  },
  leftBar: {
    backgroundColor: "#6B3FA0",
    height: "136%",
    left: 0,
    position: "absolute",
    top: 0,
    width: 5,
  },
});

export function Comment({
  comment,
  replying,
  commentReply,
  commentType,
}: CommentProps) {
  const { commentId } = useLocalSearchParams<{ commentId: string }>();
  if (!comment) return null;

  return (
    <TouchableOpacity
      style={[
        styles.commentContainer,
        {
          paddingLeft: commentType === "post" ? 16 : 32,
        },
      ]}
      onPress={() => {
        if (commentId) {
          commentReply();
        } else {
          router.push(`/ideas/${comment.ideaId}/comments/${comment.id}`);
        }
      }}
    >
      {replying.toMark === comment.id && <View style={styles.leftBar} />}
      <CommentHeader author={comment.author} createdAt={comment.createdAt} />
      <CommentBody content={comment.content} />
      <CommentActions
        ideaId={comment.ideaId}
        commentId={comment.id}
        likesCount={comment.likes}
        commentReply={commentReply}
        liked={comment.isLiked}
      />
      {!commentId && comment.replies > 0 && (
        <CommentReplies comment={comment} />
      )}
    </TouchableOpacity>
  );
}
