import { formatEventDate, formatEventTime } from "./formatDate";

export const formatChatTime = (timestamp: string | Date): string => {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return formatEventTime(date.toISOString());
};

export const formatChatDate = (timestamp: string | Date): string => {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return formatEventDate(date.toISOString());
};

export interface GroupedMessage {
  date: string;
  messages: {
    senderId: string;
    senderName?: string;
    content: string;
    timestamp: Date;
  }[];
}

export const groupMessagesByDate = (
  messages: {
    senderId: string;
    senderName?: string;
    content: string;
    timestamp: Date;
  }[],
): GroupedMessage[] => {
  const grouped: { [key: string]: GroupedMessage } = {};

  messages.forEach((message) => {
    const date = formatChatDate(message.timestamp);
    if (!grouped[date]) {
      grouped[date] = {
        date,
        messages: [],
      };
    }
    grouped[date].messages.push(message);
  });

  return Object.values(grouped);
};
