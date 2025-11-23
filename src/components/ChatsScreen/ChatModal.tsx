import React, { useRef, useState } from "react";
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
import { useLocalSearchParams } from "expo-router";
import { EmojiPopup } from "react-native-emoji-popup";
import { Provider as PaperProvider } from "react-native-paper";
import { Icon } from "../Icon";
import { Colors } from "@/constants/colors";
import { handleRequest } from "@/utils/handleRequest";
import { api } from "@/constants/api";
import { useToast } from "@/hooks/useToast";
import { Button } from "../Button";
import { Text } from "../Themed";
import { RenderUserSuggestions } from "../RenderUserSugestions";
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

type ChatModalProps = {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  onMessageSent?: () => void;
};

export function ChatModal({
  isVisible,
  setIsVisible,
  onMessageSent,
}: ChatModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { chatId } = useLocalSearchParams<{
    chatId: string;
  }>();
  const { showToast } = useToast();
  const { watch, setValue, handleSubmit } = useForm<{ content: string }>({
    defaultValues: { content: "" },
  });
  const inputRef = useRef<TextInput>(null);

  const sendMessage = async ({ content }: { content: string }) => {
    if (content.length < 1 || !chatId) return;
    const data = await handleRequest<unknown>({
      requestFn: async () =>
        api.post("/chat/send-message", {
          chatId,
          content,
        }),
      showToast,
      setIsLoading,
    });
    if (!data) return;
    setIsVisible(false);
    setValue("content", "");
    if (onMessageSent) {
      onMessageSent();
    }
  };

  const content = watch("content");

  const onSubmit = handleSubmit(sendMessage);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
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
                    placeholder="Digite sua mensagem"
                    onSubmitEditing={
                      !isLoading && content.length > 0 ? onSubmit : undefined
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
                    !isLoading && content.length > 0 ? onSubmit : undefined
                  }
                  style={content.length > 0 ? { opacity: 1 } : { opacity: 0.7 }}
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
