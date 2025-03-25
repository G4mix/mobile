import { IconType } from "react-icons";
import { CSSProperties } from "react";
import { icons } from "@/constants/icons";

type IconProps = {
  size: number;
  name: keyof typeof icons;
  color: string;
  style?: CSSProperties;
};

export function Icon({ name, size, color, style }: IconProps) {
  const HIcon = icons[name] as IconType;
  return <HIcon size={size} color={color} style={style} />;
}
