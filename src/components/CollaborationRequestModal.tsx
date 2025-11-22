import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Button } from "./Button";
import { Text } from "./Themed";
import { Colors } from "@/constants/colors";
import { NotificationDto } from "@/features/notifications/notificationsSlice";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "@/hooks/useToast";
import { useNotifications } from "@/hooks/useNotifications";
import { formatNotificationMessage } from "@/utils/formatNotificationMessage";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.russianViolet,
    borderRadius: 20,
    borderWidth: 1,
    gap: 24,
    justifyContent: "center",
    padding: 16,
  },
  root: {
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});

export function CollaborationRequestModal({
  isVisible,
  setIsVisible,
  notification,
}: {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  notification: NotificationDto;
}) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { markNotificationAsRead } = useNotifications();

  const handleStartChat = async () => {
    if (isLoading || !notification.relatedEntityId) return;

    setIsLoading(true);

    const collaborationRequest = await handleRequest<{
      ideaId: string;
      requesterId: string;
    }>({
      requestFn: async () =>
        api.get(`/get-collaboration-request`, {
          params: { collaborationRequestId: notification.relatedEntityId },
        }),
      showToast,
      setIsLoading: () => {},
      ignoreErrors: false,
    });

    if (!collaborationRequest) {
      setIsLoading(false);
      return;
    }

    const chat = await handleRequest<{ id: string }>({
      requestFn: async () =>
        api.post("/chat/start", {
          ideaId: collaborationRequest.ideaId,
          requesterId: collaborationRequest.requesterId,
        }),
      showToast,
      setIsLoading: () => {},
      ignoreErrors: false,
    });

    if (chat) {
      await markNotificationAsRead([notification.id]);
      setIsVisible(false);
      router.push(`/chats/${chat.id}` as any);
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.root}>
              <View style={styles.container}>
                <View style={{ gap: 12 }}>
                  <Text
                    style={{
                      textAlign: "justify",
                      fontWeight: "medium",
                      fontSize: 16,
                      color: Colors.light.russianViolet,
                    }}
                  >
                    Solicitação de Colaboração
                  </Text>
                  <Text
                    style={{
                      textAlign: "justify",
                      fontSize: 13.33,
                      color: Colors.light.russianViolet,
                    }}
                  >
                    {formatNotificationMessage(notification)}
                  </Text>
                </View>
                <View style={{ gap: 8 }}>
                  <Button
                    style={{ backgroundColor: Colors.light.majorelleBlue }}
                    onPress={handleStartChat}
                    disabled={isLoading}
                  >
                    <Text style={{ color: Colors.light.background }}>
                      {isLoading ? "Carregando..." : "Iniciar Chat"}
                    </Text>
                  </Button>
                  <Button onPress={handleCancel} disabled={isLoading}>
                    <Text style={{ color: Colors.light.background }}>
                      Cancelar
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
