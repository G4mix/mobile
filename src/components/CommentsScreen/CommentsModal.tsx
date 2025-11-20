import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MentionInput } from "react-native-controlled-mentions";
import { useForm } from "react-hook-form";
import { router, useLocalSearchParams } from "expo-router";
import { EmojiPopup } from "react-native-emoji-popup";
import { Provider as PaperProvider } from "react-native-paper";
import { Icon } from "../Icon";
import { Colors } from "@/constants/colors";
import { handleRequest } from "@/utils/handleRequest";
import { CommentType } from "./Comment";
import { api } from "@/constants/api";
import { useToast } from "@/hooks/useToast";
import { Button } from "../Button";
import { Text } from "../Themed";
import { useFeedQueries } from "@/hooks/useFeedQueries";
import { RenderUserSuggestions } from "../RenderUserSugestions";
import { timeout } from "@/utils/timeout";
import { InView } from "../InView";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  inputRoot: {
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.tropicalIndigo,
    borderTopWidth: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    position: "absolute",
    width: "100%",
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    flex: 1,
    justifyContent: "flex-end",
  },
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
          minWidth: "95%",
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
  replying: {
    parentComment: string;
    toMark: string;
    author?: CommentType["author"];
  };
  setReplying: Dispatch<
    SetStateAction<{
      parentComment: string;
      toMark: string;
      author?: CommentType["author"];
    }>
  >;
};

export function CommentsModal({
  isVisible,
  setIsVisible,
  replying,
  setReplying,
}: CommentsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { invalidateAllIdeas, invalidateIdeaQuery, invalidateCommentsQuery } =
    useFeedQueries();
  const { ideaId, commentId } = useLocalSearchParams<{
    ideaId: string;
    commentId: string;
  }>();
  const { showToast } = useToast();
  const { watch, setValue, handleSubmit } = useForm<{ content: string }>({
    defaultValues: { content: "" },
  });
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (replying.parentComment !== replying.toMark && replying.author) {
      setValue(
        "content",
        `@[${replying.author.user.username}](${replying.author.id}) `,
      );
    } else {
      setValue("content", "");
    }
  }, [replying.toMark]);

  const createComment = async ({ content }: { content: string }) => {
    if (content.length < 3) return;
    const data = await handleRequest<CommentType>({
      requestFn: async () =>
        api.post("/comment", {
          ideaId,
          content,
          parentCommentId: commentId || replying.parentComment || undefined,
        }),
      showToast,
      setIsLoading,
    });
    if (!data) return;
    setIsVisible(false);
    setValue("content", "");
    setReplying({
      parentComment: "",
      toMark: "",
      author: undefined,
    });
    invalidateCommentsQuery(ideaId, commentId);
    invalidateIdeaQuery(ideaId);
    invalidateAllIdeas();
    if (data.parentCommentId && !commentId) {
      await timeout(500);
      router.push(`/ideas/${data.ideaId}/comments/${data.parentCommentId}`);
    }
  };

  const content = watch("content");

  const onSubmit = handleSubmit(createComment);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback>
            <PaperProvider settings={{ rippleEffectEnabled: false }}>
              {isVisible && (
                <InView onInView={() => inputRef.current?.focus()} />
              )}
              <View style={styles.inputRoot}>
                <View style={styles.container}>
                  <EmojiPopup
                    contentContainerStyle={{
                      paddingTop: 24,
                      alignItems: "center",
                      gap: 24,
                    }}
                    closeButton={CloseButton}
                    onEmojiSelected={(emoji) =>
                      setValue("content", `${content}${emoji}`)
                    }
                  >
                    <Icon name="face-smile" size={24} />
                  </EmojiPopup>
                  <MentionInput
                    value={content}
                    onChange={(value) =>
                      setValue("content", value.slice(0, 200))
                    }
                    style={{
                      color: Colors.dark.background,
                      fontSize: 16,
                      borderWidth: 0,
                      padding: 0,
                      width: "100%",
                      maxWidth: 300,
                    }}
                    placeholder="Digite seu comentário"
                    onSubmitEditing={
                      !isLoading && content.length > 3 ? onSubmit : undefined
                    }
                    returnKeyType="done"
                    inputRef={inputRef}
                    partTypes={[
                      {
                        trigger: "@",
                        isInsertSpaceAfterMention: true,
                        renderSuggestions: ({ keyword, onSuggestionPress }) => (
                          <RenderUserSuggestions
                            keyword={keyword}
                            onSuggestionPress={(suggestion) => {
                              onSuggestionPress(suggestion);
                              inputRef.current?.focus();
                            }}
                          />
                        ),
                        textStyle: {
                          fontWeight: "bold",
                          color: Colors.light.majorelleBlue,
                        },
                      },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  onPress={
                    !isLoading && content.length > 3 ? onSubmit : undefined
                  }
                  style={content.length > 3 ? { opacity: 1 } : { opacity: 0.7 }}
                >
                  <Icon
                    name="paper-airplane"
                    size={24}
                    color={Colors.light.russianViolet}
                  />
                </TouchableOpacity>
              </View>
            </PaperProvider>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
