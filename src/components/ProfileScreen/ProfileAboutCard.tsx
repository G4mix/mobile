import { StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.majorelleBlue,
    borderRadius: 16,
    borderWidth: 2,
    display: "flex",
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
  },
  title: {
    color: Colors.light.russianViolet,
    fontSize: 16,
    fontWeight: "bold",
  },
});
export function ProfileAboutCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}
