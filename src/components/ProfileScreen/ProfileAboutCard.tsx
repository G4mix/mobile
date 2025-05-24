import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { Colors } from "@/constants/colors";
import React from "react";
import { ProfileLink } from "./ProfileLink";


const styles = StyleSheet.create({
    title: {
      color: Colors.light.russianViolet,
      fontSize: 16,
      fontWeight: "bold",
    },
    description: {
      color: Colors.light.russianViolet,
      fontSize: 16
    },
    root: {
      backgroundColor: Colors.light.white,
      borderWidth: 2,
      borderColor: Colors.light.majorelleBlue,
      display: "flex",
      gap: 8,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 10,
      borderRadius: 16
    }
})
export function ProfileAboutCard() {
  return (
    <>
      <View style={styles.root}>
        <Text style={styles.title}>Biografia</Text>
        <Text style={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Text>
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
