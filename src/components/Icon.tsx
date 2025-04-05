import createIconSetFromIcoMoon from "@expo/vector-icons/createIconSetFromIcoMoon";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import icoMoonConfig from "@/assets/heroicons/selection.json";

export type IconName =
  | "arrow-path"
  | "bolt-auto-enabled"
  | "bolt-disabled"
  | "bolt-enabled"
  | "camera"
  | "chart-bar"
  | "chat-bubble-left-right"
  | "check"
  | "code-bracket"
  | "ellipsis-horizontal"
  | "envelope"
  | "exclamation-circle"
  | "hand-thumb-up"
  | "home"
  | "link"
  | "lock-closed"
  | "magnifying-glass"
  | "photo"
  | "plus-circle"
  | "share"
  | "user"
  | "user-circle"
  | "user-group"
  | "x-mark";

export const Icon = createIconSetFromIcoMoon(
  icoMoonConfig,
  "heroicons",
  "heroicons.ttf"
) as React.ComponentType<{
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}>;
