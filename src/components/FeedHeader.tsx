import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Colors } from "@/constants/colors";
import { Icon } from "./Icon";
import logo from "@/assets/images/gamix-logo.png";

const styles = StyleSheet.create({
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  container: {
    alignItems: "center",
    backgroundColor: Colors.light.background,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: "100%",
  },
  logo: {
    maxHeight: 28,
    maxWidth: 90,
    resizeMode: "contain",
  },
});

export function FeedHeader() {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.actions}>
        <Icon
          name="chat-bubble-left-right"
          size={24}
          color={Colors.light.russianViolet}
        />
        <Icon name="bell" size={24} color={Colors.light.russianViolet} />
      </View>
    </View>
  );
}
