import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string(),
  EXPO_PUBLIC_GITHUB_CLIENT_ID: z.string(),
  EXPO_PUBLIC_LINKEDIN_CLIENT_ID: z.string(),
  EXPO_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
});

export const env = envSchema.parse(process.env);
