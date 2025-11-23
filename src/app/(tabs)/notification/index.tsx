import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Notification } from "../../../components/Notification";
import { Header } from "@/components/Header";
import { Button } from "../../../components/Button";
import { Text } from "../../../components/Themed";
import { Colors } from "../../../constants/colors";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationDto } from "@/features/notifications/notificationsSlice";
import { CollaborationRequestModal } from "@/components/CollaborationRequestModal";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

export default function NotificationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    notifications,
    isLoading,
    fetchNotifications,
    markNotificationAsRead,
    deleteAllNotifications,
    loadMore,
    refresh,
    fetchUnreadCount,
  } = useNotifications();
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationDto | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchUnreadCount();
      await fetchNotifications(0, true);
    };
    loadData();
  }, []);

  const handleNotificationPress = async (notification: NotificationDto) => {
    if (!notification.read) {
      await markNotificationAsRead([notification.id]);
    }

    if (
      notification.relatedEntityType === "COLLABORATION_REQUEST" &&
      notification.relatedEntityId
    ) {
      setSelectedNotification(notification);
      setIsModalVisible(true);
    }
  };

  const handleClearAll = async () => {
    await deleteAllNotifications();
  };

  const handleRefresh = async () => {
    await refresh();
  };

  const { refreshControl } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  return (
    <View style={{ flex: 1 }}>
      <Header
        options={{}}
        title="Notificações"
        route={route}
        navigation={navigation as any}
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Notification
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          paddingBottom: 100,
        }}
        style={{ backgroundColor: Colors.light.background }}
        refreshControl={refreshControl}
        ListEmptyComponent={
          !isLoading ? (
            <View
              style={{
                padding: 32,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.dark.jet,
                  textAlign: "center",
                }}
              >
                Nenhuma notificação
              </Text>
            </View>
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
      {notifications.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 62,
            minWidth: "100%",
            alignItems: "center",
            paddingBottom: 8,
          }}
        >
          <Button
            style={{
              backgroundColor: Colors.light.background,
              borderRadius: 8,
              padding: 16,
              minWidth: "auto",
            }}
            onPress={handleClearAll}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: Colors.dark.russianViolet,
              }}
            >
              Limpar tudo
            </Text>
          </Button>
        </View>
      )}
      {selectedNotification && (
        <CollaborationRequestModal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          notification={selectedNotification}
        />
      )}
    </View>
  );
}
