import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { Button } from "./Button";
import { Text } from "./Themed";
import { Colors } from "@/constants/colors";
import { NotificationDto } from "@/features/notifications/notificationsSlice";
import { api } from "@/constants/api";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "@/hooks/useToast";
import { useNotifications } from "@/hooks/useNotifications";
import { RootState } from "@/constants/reduxStore";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.russianViolet,
    borderRadius: 20,
    borderWidth: 1,
    gap: 24,
    justifyContent: "center",
    maxWidth: "90%",
    padding: 16,
  },
  root: {
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  section: {
    gap: 8,
  },
  sectionContent: {
    color: Colors.light.russianViolet,
    fontSize: 13.33,
    textAlign: "justify",
  },
  sectionTitle: {
    color: Colors.light.russianViolet,
    fontSize: 14,
    fontWeight: "bold",
  },
});

interface CollaborationRequestData {
  message: string;
  feedback: string | null;
  status: string;
  ideaTitle: string;
  requesterId: string;
  ideaId: string;
}

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
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [collaborationRequest, setCollaborationRequest] =
    useState<CollaborationRequestData | null>(null);
  const { markNotificationAsRead } = useNotifications();
  const currentUserId = useSelector((state: RootState) => state.user.id);

  const loadCollaborationRequest = async () => {
    if (!notification.relatedEntityId) return;

    setIsLoadingData(true);
    const data = await handleRequest<CollaborationRequestData>({
      requestFn: async () =>
        api.get(`/get-collaboration-request`, {
          params: { collaborationRequestId: notification.relatedEntityId },
        }),
      showToast,
      setIsLoading: () => {},
      ignoreErrors: false,
    });

    if (data) {
      setCollaborationRequest(data);
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    if (isVisible && notification.relatedEntityId) {
      loadCollaborationRequest();
    }
  }, [isVisible, notification.relatedEntityId]);

  const isRequester = collaborationRequest?.requesterId === currentUserId;
  const isPending = collaborationRequest?.status === "Pending";
  const showActions = !isRequester && isPending;

  const handleStartChat = async () => {
    if (isLoading || !notification.relatedEntityId || !collaborationRequest)
      return;

    setIsLoading(true);

    const chat = await handleRequest<{
      id: string;
      title: string;
      image: string | null;
    }>({
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

  const handleClose = () => {
    setIsVisible(false);
    setCollaborationRequest(null);
  };

  const getTitle = () => {
    if (notification.title === "REQUEST_COLLABORATION_APPROVED") {
      return "Solicitação Aceita";
    }
    if (notification.title === "REQUEST_COLLABORATION_REJECTED") {
      return "Solicitação Recusada";
    }
    return "Solicitação de Colaboração";
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.root}>
              <View style={styles.container}>
                {isLoadingData ? (
                  <ActivityIndicator
                    size="large"
                    color={Colors.light.majorelleBlue}
                  />
                ) : collaborationRequest ? (
                  <>
                    <View style={{ gap: 16 }}>
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 18,
                          color: Colors.light.russianViolet,
                        }}
                      >
                        {getTitle()}
                      </Text>

                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ideia:</Text>
                        <Text style={styles.sectionContent}>
                          {collaborationRequest.ideaTitle}
                        </Text>
                      </View>

                      {collaborationRequest.message && (
                        <View style={styles.section}>
                          <Text style={styles.sectionTitle}>
                            {isRequester
                              ? "Sua mensagem:"
                              : "Mensagem do solicitante:"}
                          </Text>
                          <Text style={styles.sectionContent}>
                            {collaborationRequest.message}
                          </Text>
                        </View>
                      )}

                      {collaborationRequest.feedback && (
                        <View style={styles.section}>
                          <Text style={styles.sectionTitle}>Feedback:</Text>
                          <Text style={styles.sectionContent}>
                            {collaborationRequest.feedback}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={{ gap: 8 }}>
                      {showActions ? (
                        <>
                          <Button
                            style={{
                              backgroundColor: Colors.light.majorelleBlue,
                            }}
                            onPress={handleStartChat}
                            disabled={isLoading}
                          >
                            <Text style={{ color: Colors.light.background }}>
                              {isLoading ? "Carregando..." : "Iniciar Chat"}
                            </Text>
                          </Button>
                          <Button onPress={handleClose} disabled={isLoading}>
                            <Text style={{ color: Colors.light.background }}>
                              Cancelar
                            </Text>
                          </Button>
                        </>
                      ) : (
                        <Button onPress={handleClose}>
                          <Text style={{ color: Colors.light.background }}>
                            Fechar
                          </Text>
                        </Button>
                      )}
                    </View>
                  </>
                ) : null}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
