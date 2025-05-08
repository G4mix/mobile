import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from "react-native";
import { useForm } from "react-hook-form";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { EmojiPopup } from "react-native-emoji-popup";
import { Icon } from "../Icon";
import { Colors } from "@/constants/colors";
import { TextArea } from "../TextArea";
import { handleRequest } from "@/utils/handleRequest";
import { CommentType } from "./Comment";
import { api } from "@/constants/api";
import { useToast } from "@/hooks/useToast";
import { Button } from "../Button";
import { Text } from "../Themed";
import { setLastFetchTime } from "@/features/comments/commentsSlice";
import { useFeedQueries } from "@/hooks/useFeedQueries";
import { PostType } from "../Post";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  inputRoot: {
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.tropicalIndigo,
    borderTopWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: "100%"
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    flex: 1,
    justifyContent: "flex-end"
  }
});

function CloseButton({ close }: { close: () => void }) {
  return (
    <View
      style={{ width: "100%", alignItems: "center", justifyContent: "center" }}
    >
      <Button
        onPress={close}
        style={{
          paddingVertical: 12,
          minWidth: "95%"
        }}
      >
        <Text style={{ color: Colors.light.background }}>Fechar</Text>
      </Button>
    </View>
  );
}

type CommentsModalProps = {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  commentsCount: number;
};

export function CommentsModal({
  isVisible,
  setIsVisible,
  commentsCount
}: CommentsModalProps) {
  const textAreaRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { updatePost } = useFeedQueries();
  const queryClient = useQueryClient();
  const { postId, commentId } = useLocalSearchParams<{
    postId: string;
    commentId: string;
  }>();
  const lastFetchTime = useSelector(
    (state: any) => state.comments.lastFetchTime
  );
  const { showToast } = useToast();
  const { watch, setValue, handleSubmit } = useForm<{ content: string }>({
    defaultValues: { content: "" }
  });
  const dispatch = useDispatch();

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  const addNewComment = (comment: CommentType) => {
    queryClient.setQueryData(
      ["comments", { lastFetchTime, postId, commentId }],
      (oldData: any) => {
        if (!oldData || !oldData.pages[0]) return oldData;

        const newData = {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              data: [comment, ...oldData.pages[0].data],
              total: oldData.pages[0].total + 1
            },
            ...oldData.pages.slice(1)
          ]
        };

        return newData;
      }
    );
  };

  const updateSinglePost = () => {
    queryClient.setQueryData<PostType>(["post", postId], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        commentsCount: commentsCount + 1
      };
    });
  };

  const createComment = async ({ content }: { content: string }) => {
    if (content.length < 3) return;
    const queryParams = new URLSearchParams();
    if (postId) queryParams.append("postId", postId);
    if (commentId) queryParams.append("commentId", commentId);
    const queryString = queryParams.toString();
    const url = `/comment${queryString ? `?${queryString}` : ""}`;
    const data = await handleRequest<CommentType>({
      requestFn: async () => api.post(url, { content }),
      showToast,
      setIsLoading
    });
    if (!data) return;
    addNewComment(data);
    setIsVisible(false);
    setValue("content", "");
    updatePost({ id: postId, commentsCount: commentsCount + 1 });
    updateSinglePost();
  };

  const content = watch("content");

  const onSubmit = handleSubmit(createComment);

  useEffect(() => {
    dispatch(setLastFetchTime(new Date().toISOString()));
  }, []);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback>
            <View style={styles.inputRoot}>
              <View style={styles.container}>
                <EmojiPopup
                  contentContainerStyle={{
                    paddingTop: 24,
                    alignItems: "center",
                    gap: 24
                  }}
                  closeButton={CloseButton}
                  onEmojiSelected={(emoji) =>
                    setValue("content", `${content}${emoji}`)
                  }
                >
                  <Icon name="face-smile" size={24} />
                </EmojiPopup>
                <TextArea
                  placeholder="Digite seu comentário"
                  style={{
                    color: Colors.dark.background,
                    fontSize: 16,
                    borderWidth: 0,
                    padding: 0,
                    width: "100%",
                    maxWidth: 300
                  }}
                  onChangeText={(value: string) =>
                    setValue("content", value.slice(0, 200))
                  }
                  onSubmitEditing={!isLoading ? onSubmit : undefined}
                  ref={textAreaRef}
                  value={content}
                  returnKeyType="done"
                />
              </View>
              <TouchableOpacity onPress={!isLoading ? onSubmit : undefined}>
                <Icon
                  name="paper-airplane"
                  size={24}
                  color={Colors.light.russianViolet}
                />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
