import React from "react";
import { Link } from "expo-router";
import { StyleProp, TextStyle } from "react-native";
import { Text } from "./Themed";
import { Colors } from "@/constants/colors";

interface RenderTextProps {
  content: string;
  style: StyleProp<TextStyle>;
}

export function RenderText({ content, style }: RenderTextProps) {
  const mentionRegex = /@\[(.+?)\]\((.+?)\)/g;

  const parts = [];
  let lastIndex = 0;
  let match = mentionRegex.exec(content);

  while (match !== null) {
    const [fullMatch, name, id] = match;
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      parts.push(
        <Text key={`text-${lastIndex}`}>
          {content.slice(lastIndex, startIndex)}
        </Text>
      );
    }

    parts.push(
      <Link
        key={`mention-${id}-${startIndex}`}
        href={`/profile/${id}`}
        style={[style, { color: Colors.light.majorelleBlue }]}
        asChild
      >
        <Text>@{name}</Text>
      </Link>
    );

    lastIndex = startIndex + fullMatch.length;
    match = mentionRegex.exec(content);
  }

  if (lastIndex < content.length) {
    parts.push(
      <Text key={`text-${lastIndex}`} style={style}>
        {content.slice(lastIndex)}
      </Text>
    );
  }

  return <Text style={style}>{parts}</Text>;
}
