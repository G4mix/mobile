import createIconSetFromIcoMoon from "@expo/vector-icons/createIconSetFromIcoMoon";
import React from "react";
import { StyleProp, TextStyle } from "react-native";
import icoMoonConfig from "@/assets/heroicons/selection.json";

export type IconName =
  | "arrow-left"
  | "arrow-left-end-on-rectangle"
  | "arrow-path"
  | "bolt-auto-enabled"
  | "bolt-disabled"
  | "bolt-enabled"
  | "calendar"
  | "camera"
  | "chart-bar"
  | "chat-bubble-left-right"
  | "check"
  | "chevron-up"
  | "chevron-down"
  | "chevron-right"
  | "chevron-left"
  | "code-bracket"
  | "cog-6-tooth"
  | "ellipsis-horizontal"
  | "ellipsis-vertical"
  | "envelope"
  | "exclamation-circle"
  | "face-smile"
  | "hand-thumb-up"
  | "home"
  | "link"
  | "light-bulb"
  | "lock-closed"
  | "magnifying-glass"
  | "paper-airplane"
  | "pencil"
  | "photo"
  | "plus-circle"
  | "share"
  | "user"
  | "user-plus"
  | "users"
  | "user-circle"
  | "user-group"
  | "puzzle-piece"
  | "x-mark"
  | "bell"
  | "bell-slash"
  | "bell-alert";

export const Icon = createIconSetFromIcoMoon(
  icoMoonConfig,
  "heroicons",
  "heroicons.ttf",
) as React.ComponentType<{
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}>;
