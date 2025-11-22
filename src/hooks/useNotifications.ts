import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "@/constants/api";
import { RootState } from "@/constants/reduxStore";
import {
  NotificationDto,
  appendNotifications,
  markAsRead,
  setCurrentPage,
  setHasMore,
  setLoading,
  setNotifications,
  setUnreadCount,
} from "@/features/notifications/notificationsSlice";
import { handleRequest } from "@/utils/handleRequest";
import { useToast } from "./useToast";

interface GetAllNotificationsResponse {
  total: number;
  pages: number;
  page: number;
  nextPage: number | null;
  data: NotificationDto[];
}

export function useNotifications() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { notifications, isLoading, hasMore, currentPage, unreadCount } =
    useSelector((state: RootState) => state.notifications);

  const fetchNotifications = useCallback(
    async (page: number = 0, reset: boolean = false) => {
      if (isLoading) return;

      dispatch(setLoading(true));

      const data = await handleRequest<GetAllNotificationsResponse>({
        requestFn: async () =>
          api.get("/notification", {
            params: { page, quantity: 10 },
          }),
        showToast,
        setIsLoading: () => {},
        ignoreErrors: true,
      });

      if (!data) {
        dispatch(setLoading(false));
        return;
      }

      const normalizedData = data.data.map((notif) => ({
        ...notif,
        readAt: notif.readAt ? new Date(notif.readAt).toISOString() : null,
        createdAt: new Date(notif.createdAt).toISOString(),
      }));

      if (reset) {
        dispatch(setNotifications(normalizedData));
      } else {
        dispatch(appendNotifications(normalizedData));
      }

      dispatch(setHasMore(data.nextPage !== null));
      dispatch(setCurrentPage(page));
      dispatch(setLoading(false));
    },
    [dispatch, showToast, isLoading],
  );

  const fetchUnreadCount = useCallback(async () => {
    const data = await handleRequest<{ count: number }>({
      requestFn: async () => api.get("/notification/unread-count"),
      showToast,
      setIsLoading: () => {},
      ignoreErrors: true,
    });

    if (data) {
      dispatch(setUnreadCount(data.count));
    }
  }, [dispatch, showToast]);

  const markNotificationAsRead = useCallback(
    async (notificationIds: string[]) => {
      const data = await handleRequest({
        requestFn: async () =>
          api.patch("/notification/read", { notificationIds }),
        showToast,
        setIsLoading: () => {},
        ignoreErrors: true,
      });

      if (data !== null) {
        dispatch(markAsRead(notificationIds));
        await fetchUnreadCount();
      }
    },
    [dispatch, showToast, fetchUnreadCount],
  );

  const deleteAllNotifications = useCallback(async () => {
    const data = await handleRequest({
      requestFn: async () => api.delete("/notification"),
      showToast,
      setIsLoading: () => {},
      ignoreErrors: true,
    });

    if (data !== null) {
      dispatch(setNotifications([]));
      dispatch(setUnreadCount(0));
    }
  }, [dispatch, showToast]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await fetchNotifications(currentPage + 1, false);
  }, [hasMore, isLoading, currentPage, fetchNotifications]);

  const refresh = useCallback(async () => {
    await fetchNotifications(0, true);
    await fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    const pollingInterval = setInterval(async () => {
      await fetchUnreadCount();
    }, 30000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [fetchUnreadCount]);

  return {
    notifications,
    isLoading,
    hasMore,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    deleteAllNotifications,
    loadMore,
    refresh,
  };
}
