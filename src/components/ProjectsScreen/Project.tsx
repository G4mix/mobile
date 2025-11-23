import { Image, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { Text, View } from "../Themed";

type ProjectProps = {
  title: string;
  description: string;
  icon: string;
  backgroundImage: string;
  followersCount: number;
  ideasCount: number;
  topFollowers: { name: string; icon: string }[];
};

const styles = StyleSheet.create({
  backgroundImage: {
    borderRadius: 8,
    height: 100,
    width: "100%",
  },
  icon: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  root: {
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    padding: 16,
  },
});

export function Project({
  title,
  description,
  icon,
  backgroundImage,
  followersCount,
  ideasCount,
  topFollowers,
}: ProjectProps) {
  return (
    <View style={styles.root}>
      <Text>{title}</Text>
      <Text>{description}</Text>
      <Image source={{ uri: icon }} style={styles.icon} />
      <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} />
      <Text>{followersCount}</Text>
      <Text>{ideasCount}</Text>
      <Text>{topFollowers.map((follower) => follower.name).join(", ")}</Text>
    </View>
  );
}
