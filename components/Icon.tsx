import createIconSetFromIcoMoon from "@expo/vector-icons/createIconSetFromIcoMoon";
import React, { CSSProperties } from "react";
import icoMoonConfig from "@/assets/heroicons/selection.json";

export type IconName =
  | "chart-bar"
  | "chat-bubble-left-right"
  | "check"
  | "ellipsis-horizontal"
  | "envelope"
  | "exclamation-circle"
  | "hand-thumb-up"
  | "home"
  | "lock-closed"
  | "magnifying-glass"
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
  style?: CSSProperties;
}>;
