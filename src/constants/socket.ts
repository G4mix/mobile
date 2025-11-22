import { env } from "./env";

export const getSocketUrl = (): string =>
  `wss://${env.EXPO_PUBLIC_API_URL}/chat`;
