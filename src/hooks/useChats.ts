import { useQuery } from "@tanstack/react-query";
import { api } from "@/constants/api";

export interface ChatMessage {
  senderId: string;
  content: string;
  timestamp: string | Date;
}

export interface ChatDto {
  id: string;
  title: string;
  image: string | null;
  messages: ChatMessage[];
  createdAt: string | Date;
  ownerId: string | null;
  collaborationRequestId: string | null;
  collaborationRequestStatus?: string;
}

interface GetAllChatsResponse {
  total: number;
  pages: number;
  page: number;
  nextPage: number | null;
  data: ChatDto[];
}

export function useChats(page: number = 0, quantity: number = 10) {
  return useQuery({
    queryKey: ["chats", page, quantity],
    queryFn: async () => {
      const response = await api.get<GetAllChatsResponse>("/chat", {
        params: { page, quantity },
      });
      const { data } = response;
      data.data = data.data.map((chat) => ({
        ...chat,
        messages: chat.messages.map((msg) => ({
          ...msg,
          timestamp:
            typeof msg.timestamp === "string"
              ? new Date(msg.timestamp)
              : msg.timestamp,
        })),
      }));
      return data;
    },
  });
}
