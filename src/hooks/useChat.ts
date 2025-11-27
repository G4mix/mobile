import { useQuery } from "@tanstack/react-query";
import { api } from "@/constants/api";
import { ChatDto } from "./useChats";

export function useChat(chatId: string | undefined, refetchInterval?: number) {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      if (!chatId) return null;
      const response = await api.get<ChatDto>(`/chat/${chatId}`);
      const chat = response.data;
      return {
        ...chat,
        messages: chat.messages.map((msg) => ({
          ...msg,
          timestamp:
            typeof msg.timestamp === "string"
              ? new Date(msg.timestamp)
              : msg.timestamp,
        })),
      };
    },
    enabled: !!chatId,
    refetchInterval,
  });
}
