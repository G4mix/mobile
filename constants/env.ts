import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: z.string(),
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: z.string(),
  EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID: z.string()
});

export const env = envSchema.parse(process.env);
