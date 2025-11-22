import { useEffect, useState, useRef } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { io, Socket } from "socket.io-client";
import { getItem } from "@/constants/storage";
import { getSocketUrl } from "@/constants/socket";

export interface NewMessageEvent {
  chatId: string;
  message: {
    senderId: string;
    content: string;
    timestamp: Date;
  };
}

export enum ChatEvents {
  NEW_MESSAGE = "new_message",
  USER_JOINED = "user_joined",
  USER_LEFT = "user_left",
  SEND_MESSAGE = "send_message",
  ERROR = "error",
}

export function useChatSocket(
  chatId: string | undefined,
  onNewMessage?: (event: NewMessageEvent) => void,
) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!chatId) {
      return undefined;
    }
    console.log("chatId", chatId);

    let mounted = true;

    const connectSocket = async () => {
      try {
        const accessToken = await getItem("accessToken");
        if (!accessToken) {
          setError("No access token available");
          return;
        }

        const socket = io(getSocketUrl(), {
          query: {
            token: accessToken,
            chatId,
          },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 20000,
        });

        socket.on("connect", () => {
          if (mounted) {
            setIsConnected(true);
            setError(null);
          }
        });

        socket.on("disconnect", () => {
          if (mounted) {
            setIsConnected(false);
          }
        });

        socket.on(
          ChatEvents.ERROR,
          (errorData: { type: string; message: string }) => {
            if (mounted) {
              setError(errorData.message || "Connection error");
              setIsConnected(false);
            }
          },
        );

        socket.on(ChatEvents.NEW_MESSAGE, (data: NewMessageEvent) => {
          if (mounted && onNewMessage) {
            onNewMessage(data);
          }
        });

        socketRef.current = socket;
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to connect");
        }
      }
    };

    connectSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      setError(null);
    };
  }, [chatId, onNewMessage]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
  };
}
