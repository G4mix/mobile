import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Text } from "@/components/Themed";
import { Colors } from "@/constants/colors";
import { Icon } from "../Icon";

const styles = StyleSheet.create({
  link: {
    alignItems: "center",
    backgroundColor: Colors.light.periwinkle,
    borderRadius: 12,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: "100%",
  },
  linkText: {
    color: Colors.light.jet,
    flexShrink: 1,
    flexWrap: "nowrap",
    fontSize: 11.11,
    fontWeight: "500",
    width: "100%",
  },
});

type IdeaLinkProps = {
  url?: string;
};

export function IdeaLink({ url = "" }: IdeaLinkProps) {
  return (
    // <ExternalLink
    //   href={url}
    //   aria-label={`Link para o site: ${url}`}
    //   target="_blank"
    // >
    <TouchableOpacity
      style={styles.link}
      onPress={(e) => {
        if (Platform.OS === "web") return;
        e.preventDefault();
        WebBrowser.openBrowserAsync(url);
      }}
    >
      <Icon name="link" color={Colors.light.jet} size={16} />
      <Text style={styles.linkText} numberOfLines={1}>
        {url}
      </Text>
    </TouchableOpacity>
    // </ExternalLink>
  );
}
