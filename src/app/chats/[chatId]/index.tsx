import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  View as RNView,
} from "react-native";
import { useNavigation, useLocalSearchParams, router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { View, Text } from "../../../components/Themed";
import { Colors } from "../../../constants/colors";
import { ChatMessage } from "../../../components/ChatsScreen/ChatMessage";
import { DateSeparator } from "../../../components/ChatsScreen/DateSeparator";
import { ChatInput } from "../../../components/ChatsScreen/ChatInput";
import { ChatHeader } from "../../../components/ChatsScreen/ChatHeader";
import background from "@/assets/images/BackgroundChat.png";
import { Button } from "../../../components/Button";
import { CollaborationFeedbackModal } from "../../../components/CollaborationFeedbackModal";
import { useChat } from "@/hooks/useChat";
import { RootState } from "@/constants/reduxStore";
import { formatChatTime, groupMessagesByDate } from "@/utils/formatChatDate";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "@/hooks/useToast";

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { data: chat, isLoading } = useChat(chatId, 5000);
  const currentUserId = useSelector((state: RootState) => state.user.id);
  const scrollViewRef = useRef<ScrollView>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isHandlingApproval, setIsHandlingApproval] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "approve" | "reject" | null
  >(null);

  const isOwner = chat?.ownerId === currentUserId;
  const hasPendingRequest =
    chat?.collaborationRequestId &&
    chat?.collaborationRequestStatus === "Pending";
  const showApprovalButtons =
    isOwner && hasPendingRequest && !isHandlingApproval;

  useEffect(() => {
    if (chat?.messages && chat.messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [chat?.messages]);

  const handleMessageSent = () => {
    queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
    queryClient.invalidateQueries({ queryKey: ["chats"] });
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleApproveClick = () => {
    if (!chat?.collaborationRequestId || isHandlingApproval) return;
    setPendingAction("approve");
    setIsFeedbackModalVisible(true);
  };

  const handleRejectClick = () => {
    if (!chat?.collaborationRequestId || isHandlingApproval) return;
    setPendingAction("reject");
    setIsFeedbackModalVisible(true);
  };

  const handleFeedbackConfirm = async (feedback: string) => {
    if (!chat?.collaborationRequestId || !pendingAction) return;

    setIsHandlingApproval(true);
    setIsFeedbackModalVisible(false);

    const status = pendingAction === "approve" ? "Approved" : "Rejected";

    const result = await handleRequest({
      requestFn: async () =>
        api.patch(
          "/collaboration-approval",
          { feedback },
          {
            params: {
              collaborationRequestId: chat.collaborationRequestId,
              status,
            },
          },
        ),
      showToast,
      setIsLoading: () => {},
      ignoreErrors: false,
    });

    if (result !== null) {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      if (status === "Approved") {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      }
      setTimeout(() => {
        router.back();
      }, 500);
    } else {
      setIsHandlingApproval(false);
    }

    setPendingAction(null);
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.light.tropicalIndigo,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.light.majorelleBlue} />
      </View>
    );
  }

  if (!chat) {
    return null;
  }

  const groupedMessages = groupMessagesByDate(chat.messages);

  return (
    <ImageBackground
      source={background}
      style={{
        flex: 1,
      }}
    >
      <ChatHeader
        icon={chat.image}
        displayName={chat.title}
        options={{}}
        route={route}
        navigation={navigation as any}
      />
      <ScrollView ref={scrollViewRef}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            gap: 12,
            backgroundColor: "transparent",
            paddingBottom: 100,
          }}
        >
          {showApprovalButtons && (
            <RNView
              style={{
                flexDirection: "row",
                gap: 12,
                marginBottom: 8,
                backgroundColor: "transparent",
              }}
            >
              <Button
                onPress={handleRejectClick}
                disabled={isHandlingApproval}
                style={{
                  flex: 1,
                  minWidth: 0,
                  backgroundColor: Colors.light.majorelleBlue,
                }}
              >
                <Text style={{ color: Colors.light.background }}>Recusar</Text>
              </Button>
              <Button
                onPress={handleApproveClick}
                disabled={isHandlingApproval}
                style={{
                  flex: 1,
                  minWidth: 0,
                  backgroundColor: Colors.light.russianViolet,
                }}
              >
                <Text style={{ color: Colors.light.background }}>Aceitar</Text>
              </Button>
            </RNView>
          )}
          {groupedMessages.map((group) => (
            <React.Fragment key={group.date}>
              <DateSeparator date={group.date} />
              {group.messages.map((message) => {
                const isActualUser = message.senderId === currentUserId;
                const messageKey = `${message.senderId}-${message.content}-${new Date(message.timestamp).getTime()}`;
                return (
                  <ChatMessage
                    key={messageKey}
                    date={formatChatTime(message.timestamp)}
                    isActualUser={isActualUser}
                    message={message.content}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
      <ChatInput onMessageSent={handleMessageSent} />
      <CollaborationFeedbackModal
        isVisible={isFeedbackModalVisible}
        setIsVisible={setIsFeedbackModalVisible}
        onConfirm={handleFeedbackConfirm}
        isLoading={isHandlingApproval}
        isApproval={pendingAction === "approve"}
      />
    </ImageBackground>
  );
}
