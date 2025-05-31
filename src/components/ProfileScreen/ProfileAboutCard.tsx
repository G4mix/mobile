import { StyleSheet } from "react-native";
import React from "react";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";
import { ProfileLink } from "./ProfileLink";

const styles = StyleSheet.create({
  description: {
    color: Colors.light.russianViolet,
    fontSize: 16
  },
  root: {
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.majorelleBlue,
    borderRadius: 16,
    borderWidth: 2,
    display: "flex",
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16
  },
  title: {
    color: Colors.light.russianViolet,
    fontSize: 16,
    fontWeight: "bold"
  }
});
export function ProfileAboutCard() {
  return (
    <>
      <View style={styles.root}>
        <Text style={styles.title}>Biografia</Text>
        <Text style={styles.description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </Text>
      </View>
      <View style={styles.root}>
        <Text style={styles.title}>Links</Text>
        <ProfileLink
          link="https://www.google.com/"
          key="post-link-https://www.google.com/"
          links={["https://www.google.com/"]}
          setValue={() => {}}
        />
      </View>
    </>
  );
}
