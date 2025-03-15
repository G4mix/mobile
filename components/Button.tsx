import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import { ReactNode } from "react"
import { Text } from '@/components/Themed';
import Colors from "@/constants/colors";

type ButtonProps = {
  children: ReactNode;
  onPress?: (e?: GestureResponderEvent) => void;
}

export const Button = ({ children, onPress }: ButtonProps) => {
  return (
    <Pressable style={styles.root} onPress={onPress}>
      <Text style={{ color: Colors['dark'].text}}>{children}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    minWidth: '100%',
    padding: 16,
    display: 'flex',
    borderRadius: 8,
    backgroundColor: Colors['dark'].majorelleBlue,
    alignItems: 'center',
    justifyContent: 'center',
  }
});