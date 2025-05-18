import { Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "@/components/Themed";
import { Colors } from "@/constants/colors";
import favIcon from "@/assets/images/favicon.png";
import { SendRecoverEmail } from "@/components/ForgetPasswordScreen/SendRecoverEmail";
import { InsertCode } from "@/components/ForgetPasswordScreen/InsertCode";
import { ChangePassword } from "@/components/ForgetPasswordScreen/ChangePassword";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {
    color: Colors.light.russianViolet,
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default function ForgetPasswordScreen() {
  const [actualStep, setActualStep] = useState(0);
  const steps = [SendRecoverEmail, InsertCode, ChangePassword];
  const incrementStep = () => {
    setActualStep((prevValue) => (prevValue === 2 ? prevValue : prevValue + 1));
  };
  const resetSteps = () => {
    setActualStep(0);
  };

  const ActualStep = steps[actualStep];

  useEffect(() => () => setActualStep(0), []);

  return (
    <View style={styles.container}>
      <Image source={favIcon} style={{ maxWidth: 120, maxHeight: 120 }} />
      <Text style={styles.title}>Recupere sua conta</Text>
      <ActualStep incrementStep={incrementStep} resetSteps={resetSteps} />
      <Link href="/auth/signin">
        <Text style={{ color: Colors.light.russianViolet }}>
          Lembrou sua senha?
        </Text>
        <Text style={{ color: Colors.light.tropicalIndigo }}> Entrar</Text>
      </Link>
    </View>
  );
}
